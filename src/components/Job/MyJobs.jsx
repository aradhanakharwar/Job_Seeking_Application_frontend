import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../main';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaCheck } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { ClipLoader } from 'react-spinners';
const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const [loader, setLoader] = useState(false);
  const [loaderEdit, setLoaderEdit] = useState(false);
  const [loaderDelete, setLoaderDelete] = useState(false);

  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
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
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/job/getmyjobs`, config);
        setMyJobs(data.myJobs);
        setLoader(false);
      } catch (error) {
        console.log(error);
        setLoader(false);
        toast.error(error?.response?.data.message);
        setMyJobs([]);
      };
    }
    fetchJobs();
  }, []);

  if (!isAuthorized || user && user.role !== "Employer") {
    navigateTo('/login');
  };

  //Function for enabling editing mode
  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  //Function for disabling editing mode
  const handleDisableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  const token = localStorage.getItem("token");

  const handleUpdateJob = async (jobId) => {
    setLoaderEdit(true);
    const updateJob = myJobs.find(job => job._id === jobId);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        withCredentials: true
      },
    }
    await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/job/update/${jobId}`, updateJob, config)
      .then((res) => {
        setLoaderEdit(false);
        toast.success(res.data.message);
        setEditingMode(null);
        fetchJobs();
      })
      .catch((error) => {
        setLoaderEdit(false);
        toast.error(error.response.data.message);
      });
  };


  const handleDeleteJob = async (jobId) => {
    setLoaderDelete(true);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        withCredentials: true
      },
    }
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/job/delete/${jobId}`, config)
      .then((res) => {
        setLoaderDelete(false);
        toast.success(res.data.message);
        setMyJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
        fetchJobs();
      })
      .catch((error) => {
        setLoaderDelete(false);
        toast.error(error.response.data.message);
      });
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs(prevJobs =>
      prevJobs.map(job =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  return (
    <>
      <div className="myJobs page">
        <div className="container">
          <h3>Your Posted Jobs</h3>
          {loader ? <ClipLoader /> : (
            myJobs && myJobs.length > 0 ?
              <>
                <div className="banner">
                  {myJobs.map(element => {
                    return (
                      <div className="card" key={element._id}>
                        <div className="content">
                          <div className="short_fields">
                            <div>
                              <span>
                                Title:
                              </span>
                              <input type="text" disabled={editingMode !== element._id ? true : false} value={element.title} onChange={(e) => handleInputChange(element._id, "title", e.target.value)} />
                            </div>
                            <div>
                              <span>
                                Country:
                              </span>
                              <input type="text" disabled={editingMode !== element._id ? true : false} value={element.country} onChange={(e) => handleInputChange(element._id, "country", e.target.value)} />
                            </div>
                            <div>
                              <span>
                                City:
                              </span>
                              <input type="text" disabled={editingMode !== element._id ? true : false} value={element.city} onChange={(e) => handleInputChange(element._id, "city", e.target.value)} />
                            </div>
                            <div>
                              <span>
                                Category:
                              </span>
                              <select value={element.category} onChange={(e) => handleInputChange(element._id, "category", e.target.value)} disabled={editingMode !== element._id ? true : false}>
                                <option value="">Select Category</option>
                                <option value="Graphics & Design">Graphics & Design</option>
                                <option value="Mobile App Development">
                                  Mobile App Development
                                </option>
                                <option value="Frontend Web Development">
                                  Frontend Web Development
                                </option>
                                <option value="MERN Stack Development">
                                  MERN STACK Development
                                </option>
                                <option value="Account & Finance">Account & Finance</option>
                                <option value="Artificial Intelligence">
                                  Artificial Intelligence
                                </option>
                                <option value="Video Animation">Video Animation</option>
                                <option value="MEAN Stack Development">
                                  MEAN STACK Development
                                </option>
                                <option value="MEVN Stack Development">
                                  MEVN STACK Development
                                </option>
                                <option value="Data Entry Operator">Data Entry Operator</option>
                              </select>
                            </div>
                            <div>
                              <span>Salary: {" "}
                                {
                                  element.fixedSalary ? (
                                    <input value={element.fixedSalary} onChange={(e) => handleInputChange(element._id, "fixedSalary", e.target.value)} disabled={editingMode !== element._id ? true : false} />
                                  )
                                    : (
                                      <div>
                                        <input value={element.salaryFrom} onChange={(e) => handleInputChange(element._id, "salaryFrom", e.target.value)} disabled={editingMode !== element._id ? true : false} />
                                        <input value={element.salaryTo} onChange={(e) => handleInputChange(element._id, "salaryTo", e.target.value)} disabled={editingMode !== element._id ? true : false} />
                                      </div>
                                    )
                                }
                              </span>
                            </div>
                            <div>
                              <span>Expired:</span>
                              <select value={element.expired} onChange={(e) => handleInputChange(element._id, "expired", e.target.value)} disabled={editingMode !== element._id ? true : false}>
                                <option value={true}>TRUE</option>
                                <option value={false}>FALSE</option>
                              </select>
                            </div>
                          </div>
                          <div className="long_field">
                            <div>
                              <span>Desciption:</span>
                              <textarea value={element.description} onChange={(e) => handleInputChange(element._id, "description", e.target.value)} disabled={editingMode !== element._id ? true : false} />
                            </div>
                            <div>
                              <span>Location:</span>
                              <textarea value={element.location} onChange={(e) => handleInputChange(element._id, "location", e.target.value)} disabled={editingMode !== element._id ? true : false} />
                            </div>
                          </div>
                        </div>
                        <div className="button_wrapper">
                          <div className="edit_btn_wrapper">
                            {
                              editingMode === element._id ? (
                                <>
                                  <button onClick={() => handleUpdateJob(element._id)} className='check_btn'> {loaderEdit ? <ClipLoader color="white"
                                    size={20} /> : <FaCheck />}
                                  </button>
                                  <button onClick={() => handleDisableEdit()} className='cross_btn'><RxCross2 />
                                  </button>
                                </>
                              ) : (
                                <button onClick={() => handleEnableEdit(element._id)} className='edit_btn'>
                                  Edit
                                </button>
                              )
                            }
                          </div>
                          <button onClick={() => handleDeleteJob(element._id)} className='delete_btn'>
                            {loaderDelete ? <ClipLoader color="white"
                              size={20} /> : "Delete"}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
              :
              <p>You've not posted any job or may be you deleted all of your jobs!</p>
          )
          }
        </div>
      </div>
    </>
  )
}

export default MyJobs