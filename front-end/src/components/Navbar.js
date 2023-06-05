import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { removeAllItems } from "../redux/cartSlice";

function Navbar() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const [user, setUser] = useState(false);
  const [cartCount,setCartCount] = useState("")
 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("token"),
  };
  useEffect(() => {
    setCartCount(cartItems.reduce((a, b) => a + b.quantity, 0))
    let token = localStorage.getItem("token");
    if (token) {
      axios("/api/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            setUser(true)
          }else{
            setUser(false)
          }
        })
        .catch(() => {localStorage.removeItem("token");setUser(false)});
    }
  }, [cartItems, headers]);

  const navigate = useNavigate();
  const [state, setState] = useState(false);
  function handleAccountClick() {
    if (state) {
      document.querySelector(".account-option").classList.add("active");
    } else {
      document.querySelector(".account-option").classList.remove("active");
    }
    setState((prev) => !prev);
  }
  function handleLogOut() {
    setUser(false);
    dispatch(removeAllItems());
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    navigate("/");
  }
  return (
    <div>
      <nav>
        <h3>Logo</h3>
        <div className="hamburger-menu">
          <input id="menu__toggle" type="checkbox" />
          <label className="menu__btn" htmlFor="menu__toggle">
            <span></span>
          </label>

          <ul className="menu__box">
            <li>
              <Link className="menu__item" to="/" >
                Home
              </Link>
            </li>

            <li>
              <Link className="menu__item" to="/products">
                Products
              </Link>
            </li>

            <li>
              <Link className="menu__item" to="/carts">
                Cart{" "}
                {
                  cartCount!== 0&& <><span>{cartCount}</span></>}
              </Link>
            </li>

            <li>
              <Link className="menu__item" to="/orders">
               Orders

              </Link>
            </li>
            <li>
              <div
                className="menu__item account-logo"
                onClick={handleAccountClick}
              >
                <CgProfile />
                <div className="account-option">
                  {!user ? (
                    <>
                      <p onClick={() => navigate("/login")}>Sign In</p>
                      <p onClick={() => navigate("/register")}>Sign Up</p>
                    </>
                  ) : (
                    <>
                      <p onClick={() => navigate("/account")}>My Account</p>
                      <p onClick={handleLogOut}>Sign out</p>
                    </>
                  )}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
