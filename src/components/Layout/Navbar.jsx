import React, { useContext, useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../main';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const [loader, setLoader] = useState(false);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      setLoader(true);
      const token = localStorage.getItem('token'); // Replace 'token' with the name of your cookie
      // Configure the request headers to include the token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/user/logout`, config);
      setLoader(false);
      localStorage.removeItem("token");
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      setLoader(false);
      toast.error(error.response.data.message);
      setIsAuthorized(true);
    };
  };

  return (
    <>
      <nav className={isAuthorized ? "navbarShow" : "navbarHide"}>
        <div className="container">
          <div className="logo">
            <img src="job_logo1.jpg" alt="logo" />
          </div>
          <ul className={!show ? "menu" : "show-menu menu"}>
            <li>
              <Link to={"/"} onClick={() => setShow(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to={"/job/getall"} onClick={() => setShow(false)}>
                ALL JOBS
              </Link>
            </li>
            <li>
              <Link to={"/application/me"} onClick={() => setShow(false)}>
                {
                  user && user.role === "Employer" ? "APPLICANT'S APPLICATIONS" : "MY APPLICATIONS"
                }
              </Link>
            </li>
            {
              user && user.role === "Employer" ? (
                <>
                  <li>
                    <Link to={"/job/post"} onClick={() => setShow(false)}>
                      POST NEW JOB
                    </Link>
                  </li>
                  <li>
                    <Link to={"/job/me"} onClick={() => setShow(false)}>
                      VIEW YOUR JOB
                    </Link>
                  </li>
                </>
              ) : (
                <></>
              )
            }
            <button onClick={handleLogout}>{loader ? <ClipLoader size={22} /> : "LOGOUT"}</button>
          </ul>
          <div className="hamburger">
            <GiHamburgerMenu onClick={() => setShow(!show)} />
          </div>
        </div>
      </nav >
    </>
  )
}

export default Navbar