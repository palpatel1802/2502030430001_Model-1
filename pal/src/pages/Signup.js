// // SignUp.jsx

// import React, { useState } from "react";
// import "./SignUp.css";

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     contact: "",
//     password: "",
//     institution: "",
//     bio: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     console.log(formData);

//     alert("Form Submitted Successfully!");
//   };

//   return (
//     <div className="signup-page">
//       <h1 className="heading">StudyHub</h1>

//       <div className="signup-container">
//         <h2 className="form-title">Sign Up</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="input-group">
//             <label>Full Name</label>
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Enter your Full Name here"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Email */}
//           <div className="input-group">
//             <label>Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter your Email here"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Contact Number */}
//           <div className="input-group">
//             <label>Contact Number</label>
//             <input
//               type="text"
//               name="contact"
//               placeholder="Enter your Contact Number here"
//               value={formData.contact}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="input-group">
//             <label>Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter your Password here"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Institution */}
//           <div className="input-group">
//             <label>Institution</label>

//             <div className="radio-group">
//               <select
//                 name="institution"
//                 value={formData.institution}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Institution</option>
//                 <option value="College">College</option>
//                 <option value="School">School</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//           </div>

//           {/* Bio */}
//           <div className="input-group">
//             <label>Bio</label>

//             <textarea
//               name="bio"
//               placeholder="Enter your Bio here"
//               value={formData.bio}
//               onChange={handleChange}
//               rows="3"
//             />
//           </div>

//           {/* Submit Button */}
//           <div className="button-container">
//             <button type="submit">SUBMIT</button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api/apiService";
import "../styles/Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    college: "",
    branch: "",
    semester: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const [firstName, ...restName] = formData.fullName.trim().split(" ");
    const lastName = restName.join(" ") || "Student";

    try {
      setLoading(true);
      await authAPI.register({
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        course: formData.branch || "B.Tech",
        semester: Number(formData.semester || 1),
      });
      navigate("/login");
    } catch (apiError) {
      setError(apiError.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      <form className="signup-card" onSubmit={handleSubmit}>

        <div className="auth-logo">
          <h1>StudyHub</h1>
          <p>Create Your Account</p>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
        />

        <input
          type="text"
          name="college"
          placeholder="College Name"
          value={formData.college}
          onChange={handleChange}
        />

        <input
          type="text"
          name="branch"
          placeholder="Branch"
          value={formData.branch}
          onChange={handleChange}
        />

        <select
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          required
        >
          <option value="">Semester</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
        </select>

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          minLength="8"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          minLength="8"
          required
        />

        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Signup"}
        </button>

        <p className="auth-link">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

        <p className="auth-link">
          <Link to="/">← Back to Home</Link>
        </p>

      </form>

    </div>
  );
}

export default Signup;
