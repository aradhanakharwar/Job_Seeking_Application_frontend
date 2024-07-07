import React, { useContext, useEffect, useState } from 'react';
import { Context } from "../../main";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import ResumeModal from '../Application/ResumeModal';
import { ClipLoader } from 'react-spinners';
const MyApplication = () => {
  const { isAuthorized, user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [loader, setLoader] = useState(false);

  const navigateTo = useNavigate();

  useEffect(() => {
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
      if (user && user.role === "Employer") {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}api/application/employer/getall`, config)
          .then((res) => {
            setLoader(false);
            setApplications(res.data.applications)
          });
      } else {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}api/application/jobseeker/getall`, config)
          .then((res) => {
            setLoader(false);
            setApplications(res.data.applications)
          });
      }
    } catch (error) {
      setLoader(false);
      toast.error(error.response.data.message);
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    navigateTo("/login");
  };

  const deleteApplication = (id) => {
    try {
      axios.delete(`http://localhost:4000/api/application/delete/${id}`, { withCredentials: true })
        .then((res) => {
          toast.success(res.data.message);
          setApplications(prevApplication => prevApplication.filter(e => e._id !== id))
        })
    } catch (error) {
      toast.error(error.data.message);
    };
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <section className="my_applications page">
        {
          user && user.role === "Job Seeker" ? (
            <div className="container">
              <h1>My Applications</h1>
              {
                loader ? <center><ClipLoader /></center> : (
                  applications?.length <= 0 ? (
                    <>
                      {" "}
                      <h4>No Applications Found</h4>
                    </>
                  ) : (
                    applications?.map((element) => {
                      return (
                        <JobSeekerCard
                          element={element}
                          key={element._id}
                          deleteApplication={deleteApplication}
                          openModal={openModal}
                        />
                      )
                    })
                  )
                )

              }
            </div>
          ) : (
            <div className="container">
              <h1>Applications From Job Seekers</h1>
              {
                loader ? <center><ClipLoader /></center> : (
                  applications.length <= 0 ? (
                    <>
                      <h4>No Applications Found</h4>
                    </>
                  ) : (
                    applications.map(element => {
                      return (
                        <EmployerCard
                          element={element}
                          key={element._id}
                          openModal={openModal}
                        />
                      )
                    })
                  )
                )
              }
            </div>
          )
        }
        {modalOpen && (
          <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
        )}
      </section>
    </>
  )
}

export default MyApplication;




const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>Cover Letter:</span> {element.coverLetter}
          </p>
        </div>
        <div className="resume">
          <img src={element.resume.url} alt="resume" onClick={() => openModal(element.resume.url)} />
        </div>
        <div className="btn_area">
          <button onClick={() => deleteApplication(element._id)}>Delete Application</button>
        </div>
      </div>
    </>
  );
};




const EmployerCard = ({ element, openModal }) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>Cover Letter:</span> {element.coverLetter}
          </p>
        </div>
        <div className="resume">
          <img src={element.resume.url} alt="resume" onClick={() => openModal(element.resume.url)} />
        </div>
      </div>
    </>
  )
}