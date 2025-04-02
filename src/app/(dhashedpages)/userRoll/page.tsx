"use client";

import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useMemo, useState } from "react";
import { CiEdit } from "react-icons/ci";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import styles from "./page.module.css";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { div } from "framer-motion/client";

ModuleRegistry.registerModules([AllCommunityModule]);

const UserRoll = () => {
  let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [rowData, setRowData] = useState<any[]>([]);

   //permission checker
    useEffect(() => {
      // Fetch the permit value from localStorage
      const permit =
        typeof window !== "undefined"
          ? localStorage.getItem("permits") ?? ""
          : "";
      console.log("Permit from localStorage:", permit); // Debugging log
  
      // Redirect logic
      if (permit === "") {
        // If permit is not set, redirect to login
        console.warn("No permit found, redirecting to login...");
        window.location.href = "/auth/login";
        return;
      }
  
      // Check if the user is a super admin (permit === "0")
      if (permit === "0") {
        // Super admin has access to all pages, so no need to redirect
        return;
      }
  
      // Check if the user has the required permission for the dashboard
      if (!permit.includes("4")) {
        // If the user doesn't have permission, redirect to login
        console.warn("User does not have permission, redirecting to login...");
        window.location.href = "/auth/login";
        return;
      }
    }, []);


  // for permits to admin or sub admin
  const ModulesPermittedRenderer = (params: { value: string }) => {
    const modules = params.value.split(",");
    // console.log(modules)
    // Define all pages for Admin (when modules_permitted is "0")
    const allPages = [
      "Dashboard",
      "Alert Logs",
      "Data Logs",
      "Device Management",
      "Reports",
      "Settings",
      "User Role",
    ];

    // If modules_permitted is "0" (Admin), return all pages vertically
    if (modules.includes("0")) {
      return (
        <div>
          {allPages.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      );
    }

    // For Sub Admin, map the accessible modules to their names
    const moduleNames = modules.map((module) => {
      switch (module) {
        case "1":
          return "Admin User Page";
        case "2":
          return "Dashboard";
        case "3":
          return "Raw Data Page";
        default:
          return "Unknown";
      }
    });

    return (
      <div>
        {moduleNames.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    );
  };

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "id",
      headerName: "Sl. Id",
      filter: false,
      maxWidth: 80,
    },
    { field: "role_name", headerName: "Role Name", filter: true },
    {
      field: "modules_permitted",
      headerName: "Modules Permitted",
      filter: "agTextColumnFilter",
      autoHeight: true,
      cellRenderer: ModulesPermittedRenderer, // Use the custom cell renderer
    },
    {
      field: "status",
      headerName: "Access",
      filter: false,
      valueFormatter: (params) => (params.value === 1 ? "Active" : "Inactive"),
    },
  ]);

  useEffect(() => {
    fetcher();
  }, []);

  function fetcher() {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      fetch(`${baseURL}/app-users/all-roles/${token}`)
        .then((res) => res.json())
        .then((data) => {
          const transformedData = data.map((item: any) => ({
            ...item,
            modules_permitted: item.modules_permitted || "0", // Ensure modules_permitted is not null
          }));
          setRowData(transformedData);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function handleEdit(data: any) {
    console.log(data);
  }

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deviceId, setDeviceId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [password, setPassword] = useState("");
  const [radioval, setRadioval] = useState("");
  const [show, setShow] = React.useState(false);
  const handleClickpass = () => setShow(!show);

  const handleAddDevice = () => {
    const newDevice = {
      deviceId,
      deviceName,
      password,
      radioval,
    };
    console.log(newDevice);
    setDeviceId("");
    setDeviceName("");
    setPassword("");
    setRadioval("");
    onClose();
  };

  return (
    <div style={{ width: "80vw", height: "60vh", maxWidth: "1250px" }}>
      <div className={styles.hello}>
        <h3>User management</h3>
        <p>
          View/manage user accounts and configure roles for streamlined access
          control.
        </p>
      </div>
      <div
        style={{
          height: "100%",
          width: "80vw",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            height: "60px",
            width: "100%",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px 10px 0px 0px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: "600" }}>User management</p>
          <Button onClick={onOpen} colorScheme="green">
            Add New User
          </Button>
        </div>
        <div style={{ height: "100%", width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            paginationAutoPageSize={true}
            defaultColDef={{
              sortable: true,
              filter: true,
              floatingFilter: true,
              resizable: true,
              flex: 1,
              filterParams: {
                debounceMs: 0,
                buttons: ["reset"],
              },
            }}
            getRowHeight={(params) => {
              const roles = params.data?.modules_permitted.split(",") || [];
              const baseHeight = 20;
              const additionalHeight = roles.length * 20;
              return baseHeight + additionalHeight;
            }}
          />
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter User Name"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
              />
              <FormLabel>Email ID</FormLabel>
              <Input
                placeholder="Enter Email Id"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
              />
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClickpass}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <br />
              <FormLabel>Access To Screens</FormLabel>
              <CheckboxGroup colorScheme="green">
                <Stack direction="column">
                  <Checkbox value="1">Dashboard</Checkbox>
                  <Checkbox value="2">All Devices</Checkbox>
                  <Checkbox value="3">OTA Update</Checkbox>
                  <Checkbox value="4">Alert Logs</Checkbox>
                  <Checkbox value="5">User Role</Checkbox>
                </Stack>
              </CheckboxGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleAddDevice}>
              Add User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserRoll;
