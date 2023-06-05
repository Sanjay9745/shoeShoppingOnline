/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "../style/form.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { validate } from "./validate";
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("token"),
  };
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      axios("/api/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            navigate("/");
          }
        })
        .catch(() => {localStorage.removeItem("token");toast.error("Fake or Invalid Token");});
    }
  }, [navigate, headers]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const cart = useSelector((state) => state.cart);
  let cartItems = cart.map((data) => {
    return {
      productId: data.id,
      quantity: data.quantity,
      img: data.img,
      name: data.name,
      price: data.price,
    };
  });
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  function handleSubmit(e) {
    e.preventDefault();
    if (validate(name, email, password)) {
      const params = JSON.stringify({
        name: name, //string or number or object or array or boolean or null or undefined. 	Can also be a function or other custom data
        email: email,
        password: password,
        cartItems: cartItems,
      });

      axios
        .post("/api/register", params, { headers })

        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("token", res.data.token); //token is the key to store the token in the storage.  localStorage is a built in JavaScript storage.  localStorage.token is the key to store the token in the storage.  token is what we store in the storage.  localStorage.token is what we get from the storage.  token is what we store in the local storage.  localStorage.token is what we get from the storage.  So, we set the token in the storage to the token we get from the storage.  So, we can now use the token
            navigate("/");
            toast.success("Sign Up Success", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            });
          }
        })
        .catch((e) => console.log(e)); //console log the dat
       
      if (showPassword) {
        setShowPassword(false); // Reset password visibility after form submission
      }
    }
  }

  return (
    <>
      <div className="container">
        <h1>Sign Up</h1>
        <div className="container-box">
          <form className="form-signin" onSubmit={handleSubmit} noValidate>
            <label htmlFor="username">Full Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              id="name"
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Your Email"
              required
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password">
            <label htmlFor="password">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              name="password"
              placeholder="Enter Your Password"
              required
              autoComplete="false"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              type="button"
              className="toggle-password-btn"
              onClick={handleTogglePassword}
            >
              {showPassword ? <img src="/images/show.png" alt="" /> : <img src="/images/hide.png" alt="" />}
            </span>
            </div>
            <div>
              <button className="form-btn">Sign Up</button>
            </div>
            <div>
              Go to <Link to="/login">Sign In</Link>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default Register;
