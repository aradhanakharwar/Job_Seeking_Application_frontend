import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { ClipLoader } from "react-spinners";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const { isAuthorized } = useContext(Context);
  const [loader, setLoader] = useState(false);
  const navigateTo = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    try {
      setLoader(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true
        },
      }
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}api/job/getall`, config)
        .then((res) => {
          setJobs(res.data);
          setLoader(false);
        });
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  }, []);
  if (!isAuthorized) {
    navigateTo("/");
  }

  return (
    <section className="jobs page">
      <div className="container">
        <h1>ALL AVAILABLE JOBS</h1>
        {loader ? <ClipLoader
          color="#2d5649"
          size={40}
        /> :
          <div className="banner">
            {jobs?.jobs?.length > 0 ? (
              jobs.jobs.map((element) => {
                return (
                  <div className="card" key={element._id}>
                    <p>{element.title}</p>
                    <p>{element.category}</p>
                    <p>{element.country}</p>
                    <Link to={`/job/${element._id}`}>Job Details</Link>
                  </div>
                );
              })) : <p>No jobs posted yet!</p>
            }
          </div>
        }
      </div>
    </section>
  );
};

export default Jobs;