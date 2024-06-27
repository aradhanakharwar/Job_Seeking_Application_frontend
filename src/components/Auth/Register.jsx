import React, { useContext, useState } from 'react';
import { Context } from "../../main";
import toast from 'react-hot-toast';
import { FaPencilAlt, FaRegUser } from 'react-icons/fa';
import { MdOutlineMailOutline } from 'react-icons/md';
import { FaPhoneFlip } from 'react-icons/fa6';
import { RiLock2Fill } from 'react-icons/ri';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/user/register`, { name, email, password, phone, role }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message)
    };
  };

  if (isAuthorized) {
    return <Navigate to={"/"} />
  }

  return (
    <>
      <div className="authPage">
        <div className="container">
          <div className="header">
            <img src="CareerHaven.png" alt="logo" />
            <h3>Create a new account</h3>
          </div>
          <form>
            <div className="inputTag">
              <label>Register As</label>
              <div>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select Role</option>
                  <option value="Employer">Employer</option>
                  <option value="Job Seeker">Job Seeker</option>
                </select>
                <FaRegUser />
              </div>
            </div>
            <div className="inputTag">
              <label>Name</label>
              <div>
                <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
                <FaPencilAlt />
              </div>
            </div>
            <div className="inputTag">
              <label>Email</label>
              <div>
                <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='abc@gmail.com' />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="inputTag">
              <label>Phone Number</label>
              <div>
                <input type='number' value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='0987654321' />
                <FaPhoneFlip />
              </div>
            </div>
            <div className="inputTag">
              <label>Password</label>
              <div>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                <RiLock2Fill />
              </div>
            </div>
            <button onClick={handleRegister} type="submit">Register</button>
            <Link to={'/login'}>Login now</Link>
          </form>
        </div>
        <div className="banner">
          <img src="/register.png" alt="register" />
        </div>
      </div>
    </>
  )
}

export default Register