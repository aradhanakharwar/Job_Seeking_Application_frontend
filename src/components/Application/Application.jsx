import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);

  const { isAuthorized, user } = useContext(Context);

  const navigateTo = useNavigate();

  // Function to handle file input changes
  const handleFileChange = (event) => {
    const resume = event.target.files[0];
    setResume(resume);
  };

  const { id } = useParams();
  const handleApplication = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/application/post`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume("");
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthorized || user && user.role === "Employer") {
    navigateTo("/login");
  };

  return (

    <section className="application">
      <div className="container">
        <h3>Application Form</h3>
        <form onSubmit={handleApplication}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" />
          <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your Phone" />
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your Address" />
          <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Cover Letter"></textarea>
          <div>
            <label style={{ textAlign: "start", display: "block", fontSize: "20px" }}>Select Resume</label>
            <input type="file" accept=".jpg, .png, .webp, .jpeg" onChange={(handleFileChange)} style={{ width: "100%" }} />
          </div>
          <button type="submit">Send Application</button>
        </form>
      </div>
    </section>

  )
}

export default Application