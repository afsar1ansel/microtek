"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./globals.css";
import Image from "next/image";
import logo from "/public/logo_3.png";
import profile from "/public/Profile.png";

import { IoIosHome } from "react-icons/io";
import { RiUser3Line } from "react-icons/ri";
import { AiOutlineDatabase } from "react-icons/ai";
// import { IoSettingsOutline } from "react-icons/io5";
import { FaPowerOff } from "react-icons/fa6";
// import { FaUserEdit } from "react-icons/fa";
// import { FiAlertTriangle } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";

import { usePathname } from "next/navigation";
import {
  Button,
  ChakraProvider,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

type NavItem =
  | "dashboard"
  // | "deviceManagement"
  | "userManagement"
  // | "userRoll"
  | "dataLogs"
  // | "alertLogs"
  // | "Reports"
  | "Profile"
  // | "Support"
  | "Logout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const cleanedPathname = pathname.replace(/^\/+/, ""); // Remove leading slashes
  const basePath = cleanedPathname.split("/")[0]; // Extract the base path
  // console.log(basePath);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [active, setActive] = useState<NavItem>(basePath as NavItem);
  let baseURL = process.env.NEXT_PUBLIC_BASE_URL;

 const [permit , setPermit] = useState("");

   useEffect(() => {
     const token =
       typeof window !== "undefined" ? localStorage.getItem("token") : null;
     if (!token) {
       console.warn("No User found, redirecting to login...");
       window.location.href = "/auth/login";
     }

   }, []);

  useEffect(() => {
    setActive(basePath as NavItem);
   const perm =
     typeof window !== "undefined" ? localStorage.getItem("permit") ?? "" : "";
    setPermit(perm);
    handleBeforeUnload(); 
  }, [pathname]);

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
      // console.log(data);
      localStorage.removeItem("token");
      localStorage.removeItem("permits");
      window.location.href = "/auth/login";
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  };

  useEffect(() => {
    // const token =
    //   typeof window !== "undefined" ? localStorage.getItem("token") : null;
    // if (!token) {
    //   console.warn("No User found, redirecting to login...");
    //   window.location.href = "/auth/login";
    // }

     handleBeforeUnload() 

  }, []);

  function handleBeforeUnload() {
    const perm =
      typeof window !== "undefined"
        ? localStorage.getItem("permits") ?? ""
        : "";
    // setPermit(perm);
    setPermit("0");

  }

   const hasPermission = (requiredPermission: string) => {
     if (permit === "0") {
       return true;
     }

     if (permit.includes(requiredPermission)) {
       return true;
     }
     return false;
   };

  return (
    // <html lang="en">
    // <body>
    <ChakraProvider>
      <div className="app-container">
        {/* Header Section */}
        <header className="header">
          <div className="search-bar">
            {/* <div>
              <FaSearch className="searchIcon" />
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
              />
            </div> */}
            <div className="icons">
              <div className="user">
                <Image
                  src={profile}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="user-image"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="main-content">
          {/* Sidebar Navigation */}
          <nav className="sidebar">
            <Image
              src={logo}
              alt="Logo"
              className="logo"
              width={170}
              height={80}
            />
            <ul>
              {hasPermission("2") && (
                <li className={active === "dashboard" ? "active" : ""}>
                  <IoIosHome />
                  <Link className="link" href="/dashboard">
                    <p className="linkname">Dashboard</p>
                  </Link>
                </li>
              )}
              {/* <li className={active === "deviceManagement" ? "active" : ""}>
                <TbDeviceAnalytics />
                <Link href="/deviceManagement">
                  <p className="linkname">Device Management</p>
                </Link>
              </li> */}
              {hasPermission("1") && (
                <li className={active === "userManagement" ? "active" : ""}>
                  <RiUser3Line />
                  <Link href="/userManagement">
                    <p className="linkname">User Management</p>
                  </Link>
                </li>
              )}
              {/* {hasPermission("4") && (
                <li className={active === "userRoll" ? "active" : ""}>
                  <FaUserEdit />
                  <Link href="/userRoll">
                    <p className="linkname">User Role</p>
                  </Link>
                </li>
              )} */}
              {hasPermission("3") && (
                <li className={active === "dataLogs" ? "active" : ""}>
                  <AiOutlineDatabase />
                  <Link href="/dataLogs">
                    <p className="linkname">Data Logs</p>
                  </Link>
                </li>
              )}
              {/* {hasPermission("1") && (
                <li className={active === "alertLogs" ? "active" : ""}>
                  <FiAlertTriangle />
                  <Link href="/alertLogs">
                    <p className="linkname">Alert Logs</p>
                  </Link>
                </li>
              )} */}
              {/* <li className={active === "Reports" ? "active" : ""}>
                <IoMdPaper />
                <Link href="/Reports">
                  <p className="linkname">Reports</p>
                </Link>
              </li> */}
              {hasPermission("1") && (
                <li className={active === "Profile" ? "active" : ""}>
                  <CgProfile />
                  <Link href="/Profile">
                    <p className="linkname">Profile</p>
                  </Link>
                </li>
              )}
              {/* <li className={active === "Support" ? "active" : ""}>
                <MdHelpOutline />
                <Link href="/Support">
                  <p className="linkname">Support</p>
                </Link>
              </li> */}
              <li
                className={active === "Logout" ? "active" : ""}
                onClick={onOpen}
                style={{ cursor: "pointer" }}
              >
                <FaPowerOff />
                <p className="linkname">Logout</p>
              </li>
            </ul>
          </nav>

          <main className="content">{children}</main>
        </div>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalBody textAlign="center" padding="16px">
              <Flex
                justifyContent="center"
                alignItems="center"
                width={"100%"}
                flexDirection={"column"}
                gap={4}
              >
                <MdLogout size={100} color="red" />
                <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "rgba(25, 27, 28, 1)",
                    }}
                  >
                    Confirm Logout
                  </h2>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "rgba(98, 108, 112, 1)",
                    }}
                  >
                    Are you sure you want to log out?
                  </p>
                </div>
              </Flex>
            </ModalBody>

            <ModalFooter justifyContent="center" gap={4} padding="20px">
              <Button
                style={{
                  color: "red",
                  backgroundColor: "white",
                  border: "1px solid red",
                  padding: "10px 20px",
                  width: "154px",
                  height: "54px",
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
              <Button
                colorScheme="gray"
                mr={3}
                onClick={onClose}
                style={{ padding: "10px 20px", width: "160px", height: "60px" }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </ChakraProvider>
    // </body>
    // </html>
  );
}
