import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Context } from '../../main';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [loader, setLoader] = useState(false);
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  const token = localStorage.getItem('token'); // Replace 'token' with the name of your cookie
  useEffect(() => {
    setLoader(true);
    // Configure the request headers to include the token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    axios.get(`${import.meta.env.VITE_BACKEND_URL}api/job/getsinglejob/${id}`, config)
      .then((res) => {
        setLoader(false);
        setJob(res.data.job);
      }).catch((err) => {
        setLoader(false);
        console.log(err.response.data.message);
      });
  }, []);

  if (!isAuthorized) {
    navigateTo('/login')
  }

  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Job Details</h3>
        {loader ? <ClipLoader /> :
          <div className="banner">
            <p>
              Title: <span> {job.title}</span>
            </p>
            <p>
              Category: <span>{job.category}</span>
            </p>
            <p>
              Country: <span>{job.country}</span>
            </p>
            <p>
              City: <span>{job.city}</span>
            </p>
            <p>
              Location: <span>{job.location}</span>
            </p>
            <p>
              Description: <span>{job.description}</span>
            </p>
            <p>
              Job Posted On: <span>{job.jobPostedOn}</span>
            </p>
            <p>
              Salary:{" "}
              {job.fixedSalary ? (
                <span>{job.fixedSalary}</span>
              ) : (
                <span>
                  {job.salaryFrom} - {job.salaryTo}
                </span>
              )}
            </p>
            {user && user.role === "Employer" ? (
              <></>
            ) : (
              <Link to={`/application/${job._id}`}>Apply Now</Link>
            )}
          </div>
        }
      </div>
    </section>
  )
}

export default JobDetails