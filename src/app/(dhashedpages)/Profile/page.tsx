"use client";

import React, { useEffect, useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import styles from "./page.module.css";
import Image from "next/image";
import profile from "/public/BG.png";
import { FaUserEdit } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";

import {
  Button,
  ButtonGroup,
  // CheckboxIcon,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useEditableControls,
} from "@chakra-ui/react";

import { CiEdit } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { AiTwotoneMail } from "react-icons/ai";
import { BiPhoneCall } from "react-icons/bi";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { GoMail } from "react-icons/go";
import { IoCall } from "react-icons/io5";

ModuleRegistry.registerModules([AllCommunityModule]);

const Profile = () => {
  let baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  // Handle file selection
  // const [files, setFiles] = useState<File[]>([]);
  // const handleFiles = (selectedFiles: FileList | null) => {
  //   if (!selectedFiles) return;
  //   const newFiles = Array.from(selectedFiles);
  //   setFiles((prevFiles) => [
  //     ...prevFiles,
  //     ...newFiles.filter(
  //       (file) => !prevFiles.some((f) => f.name === file.name)
  //     ),
  //   ]);
  // };

  // Handle removing a 
  // const removeFile = (fileName: string) => {
  //   setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  // };

  //   password
  const [show, setShow] = React.useState(false);
  const [newPass, setNewpass] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
 const [loading, setLoading] = useState(false);
  const [userID, setUserID] = React.useState("User name");
  const [userEmail, setUserEmail] = React.useState("Dire@gmail.com");

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleClick = () => setShow(!show);

  // ediltable
  function EditableControls() {

    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton
          size="sm"
          bgColor={"transparent"}
          icon={<FaCheck />}
          // aria-label="Save changes"
          {...{ ...getSubmitButtonProps(), "aria-label": "Save changes" }}
        />
        <IconButton
          size="sm"
          bgColor={"transparent"}
          icon={<IoMdClose />}
          // aria-label="Cancel editing"
          {...{ ...getCancelButtonProps(), "aria-label": "Cancel editing" }}
        />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton
          size="sm"
          bgColor={"transparent"}
          icon={<CiEdit />}
          // aria-label="Edit field"
          {...{ ...getEditButtonProps(), "aria-label": "Edit field" }}
        />
      </Flex>
    );
  }

  // for password changing

  const handleLogout = () => {

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      console.warn("No token found, redirecting to login...");
      window.location.href = "/auth/login";
      return;
    }

    fetch(`${baseURL}/app-users/logout/${token}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  async function handleSubmit() {
    // console.log("Current Password:", currentPassword);
    // console.log("New Password:", newPassword);
    // console.log("Confirm Password:", confirmPassword);
    setLoading(true); 

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Password validation
    if (newPassword !== confirmPassword) {
      console.log("Passwords do not match");
      alert("Passwords do not match");
       setLoading(false);
      return;
    }

    const detail = new FormData();
    detail.append("oldPassword", currentPassword);
    detail.append("newPassword", newPassword);
    detail.append("token", token || "");

    console.log(Object.entries(detail));
    try {
      const response = await fetch(`${baseURL}/app-users/change-password`, {
        method: "POST",
        body: detail,
      });

      const data = await response.json();
      console.log("Success:", data);

      // {"errFlag": 0,"message": "Password updated successfully."}

      if (data.errFlag === 0) {
        alert("Password changed successfully!");
        handleLogout();
      } else {
        alert(data.message);
      }

      // Optionally, clear password fields after success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Request failed:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false); // Stop loading in all cases
    }
  }

  // for email changing
  function hadndleEditEmail(newEmail: string) {
    // console.log("Updated Email:", newEmail);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    let email = new FormData();
    email.append("email", newEmail);
    email.append("token", token || "");

    fetch(`${baseURL}/app-users/change-email`, {
      method: "POST",
      body: email,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // {"errFlag": 0,"message": "Email Changed Successfully"}

        if (data.errFlag === 0) {
          alert("Email changed successfully!");
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    setUserEmail(newEmail);
  }

  // for user id changing
  function handleEditUserId(newUserId: string) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    // console.log("Updated User ID:", newUserId);

    let userId = new FormData();
    userId.append("username", newUserId);
    userId.append("token", token || "");

    fetch(`${baseURL}/app-users/change-username`, {
      method: "POST",
      body: userId,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // {"errFlag": 0,"message": "username Changed Successfully"}
        if (data.errFlag === 0) {
          alert("User ID changed successfully!");
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    setUserID(newUserId);
  }

  return (
    <div className={styles.container}>
      <div className={styles.hello}>
        <div >
          <GoMail size={20} color="#848F8B" />
          <p>Email Support</p>
        </div>
        <div>
          <IoCall size={20} color="#848F8B" />
          <p>Call Assistance</p>
        </div>
      </div>

      <div className={styles.mainBody}>
        <div className={styles.info}>
          <div className={styles.infoHead}>
            <h3>Personal Info</h3>
          </div>

          <div className={styles.infoBody}>
            <div className={styles.infoBox}>
              <AiTwotoneMail size={30} />
              <div>
                <label htmlFor="email">Email</label>
                <Editable
                  textAlign="center"
                  defaultValue={userEmail}
                  fontSize="16px"
                  isPreviewFocusable={false}
                  onSubmit={hadndleEditEmail}
                >
                  <Flex className={styles.editable}>
                    <EditablePreview />
                    <Input as={EditableInput} />
                    {/* <EditableControls /> */}
                  </Flex>
                </Editable>
              </div>
            </div>

            <div className={styles.infoBox}>
              <FaUserEdit size={30} />
              <div>
                <label htmlFor="/">User ID</label>
                <Editable
                  textAlign="center"
                  defaultValue={userID}
                  fontSize="16px"
                  isPreviewFocusable={false}
                  onSubmit={handleEditUserId}
                >
                  <Flex className={styles.editable}>
                    <EditablePreview />
                    <Input as={EditableInput} />
                    {/* <EditableControls /> */}
                  </Flex>
                </Editable>
              </div>
            </div>

            <div className={styles.infoBox}>
              <FaPhoneAlt size={30} />
              <div>
                <label htmlFor="/">Phone Number</label>
                <Editable
                  textAlign="center"
                  defaultValue={"+91 1234567890"}
                  fontSize="16px"
                  isPreviewFocusable={false}
                  onSubmit={handleEditUserId}
                >
                  <Flex className={styles.editable}>
                    <EditablePreview />
                    <Input as={EditableInput} />
                    {/* <EditableControls /> */}
                  </Flex>
                </Editable>
              </div>
            </div>

            <div className={styles.infoBox}>
              <IoLocationOutline size={30} />
              <div>
                <label htmlFor="email">Location</label>
                <Editable
                  textAlign="center"
                  defaultValue="Home 1024/N, Road# 17/A, basveshwar nagar, Bangalore"
                  fontSize="16px"
                  isPreviewFocusable={false}
                >
                  <Flex className={styles.editable}>
                    <EditablePreview />
                    <Input as={EditableInput} />
                    {/* <EditableControls /> */}
                  </Flex>
                </Editable>
              </div>
            </div>
          </div>
        </div>

        {/* <div className={styles.password}>
          <div className={styles.infoHead}>
            <h3>Change Password</h3>
          </div>

          <div className={styles.passBody}>
            <div>
              <FormLabel>Current Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleClick}
                    bgColor="white"
                  >
                    {show ? <FaRegEye /> : <FaRegEyeSlash />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </div>

            <div>
              <FormLabel>New Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={newPass ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setNewpass(!newPass)}
                    bgColor="white"
                  >
                    {newPass ? <FaRegEye /> : <FaRegEyeSlash />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </div>

            <div>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={confirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setConfirm(!confirm)}
                    bgColor="white"
                  >
                    {confirm ? <FaRegEye /> : <FaRegEyeSlash />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </div>

            <Button
              colorScheme="green"
              disabled={loading}
              mt="4"
              onClick={handleSubmit}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Profile;
