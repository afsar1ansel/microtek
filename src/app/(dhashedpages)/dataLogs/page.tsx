"use client";

import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useMemo, useState } from "react";
import { PiFileCsvDuotone } from "react-icons/pi";
import { GrFormView } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import styles from "./page.module.css";
import { FaRegCopy } from "react-icons/fa";
import { PiFilePdf } from "react-icons/pi";
import {
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Heading,
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
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";

import { toast, ToastContainer } from "react-toastify";

ModuleRegistry.registerModules([AllCommunityModule]);

const DataLogs = () => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;


  const [rowData, setRowData] = useState<any[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
    const handleIconClick = (
      event: React.MouseEvent,
      type: "csv" | "pdf",
      id: string
    ) => {
      // Highlight the clicked icon
      const iconElement = event.currentTarget as HTMLElement;
      iconElement.style.color = "rgba(13, 94, 54, 1)";

      // Perform the download action
      if (type === "csv") {
        downloadCSV(id);
        setTimeout(() => {
          iconElement.style.color = "inherit";
        }, 500);
      } else if (type === "pdf") {
        downloadPDf(id);
        setTimeout(() => {
          iconElement.style.color = "inherit";
        },500);
        // iconElement.style.color = "inherit";
      }
    };
  
    
  const [slNo, setslNo] = useState(1);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "index",
      headerName: "Sl. No.",
      maxWidth: 80,
      filter: false,
      suppressAutoSize: true,
      valueGetter: (params) =>
        params.node?.id !== undefined ? Number(params.node.id) + 1 : null,
    },
    {
      field: "customer_name",
      headerName: "Service Req. no.",
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => (
        <div style={{ cursor: "pointer" }}>
          <div onClick={() => handleSummary(params.data)}>
            {params.data.customer_name}
          </div>
        </div>
      ),
    },
    {
      field: "username",
      headerName: "Engg Id",
      filter: "agTextColumnFilter",
    },
    {
      field: "device_id",
      headerName: "Device ID",
      filter: "agTextColumnFilter",
    },
    {
      field: "filename",
      headerName: "File Name",
      // maxWidth: 110,
    },
    {
      field: "upload_date",
      headerName: "Upload Date",
      maxWidth: 150,
    },
    {
      field: "status",
      headerName: "Status",
      maxWidth: 100,
      filter: false,
      cellRenderer: (params: any) => (
        <div style={{ color: params.data.status === 1 ? "green" : "red" }}>
          {params.data.status === 1 ? "Avilable" : "Failed"}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      filter: false,
      maxWidth: 120,
      cellRenderer: (params: any) => (
        <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
          <div
            style={{ cursor: "pointer" }}
            onClick={(e) =>
              handleIconClick(e, "csv", params.data.scanned_file_log_id)
            }
          >
            <PiFileCsvDuotone size={30} />
          </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={(e) =>
              handleIconClick(e, "pdf", params.data.saved_file_name)
            }
          >
            <PiFilePdf size={30} />
          </div>
        </div>
      ),
    },
  ]);

  //pdf
  async function downloadPDf(name: any) {
    if (!name) {
      toast.error("File name is missing. Unable to download PDF.");
      return;
    }
    onLoadOpen();

    try {
      const response = await fetch(`${baseURL}/pdf-report/${name}`, {
        method: "GET",
      });
      const data = await response.blob();
      // console.log(data);


      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = name || "report.pdf";
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
       setTimeout(() => {
         onLoadClose();
       }, 1000);
    }
  }

  //data fetch
  async function fetchData() {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const response = await fetch(
        `${baseURL}/app/reports/raw-data-logs/${token}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      // console.log(data);
      setRowData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  //csv file
  const convertToCSV = (data: any[]) => {
    const headers = Object.keys(data[0]).join(",") + "\n";
    const rows = data.map((row) => Object.values(row).join(",")).join("\n");
    return headers + rows;
  };

  // const [jsonData, setJsonData] = useState<any[]>([]);

  async function fetchjsonrawdata(number: any) {
    // console.log("datanumber", datanumber);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const response = await fetch(
        `${baseURL}/app/reports/logged-values/${token}/${number}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      // console.log(data);
      // setJsonData(data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const downloadCSV = async (datanumber: any) => {
    const num = datanumber;
    const jsonData = await fetchjsonrawdata(num);

    const csvData = convertToCSV(jsonData);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // modal
  const {
    isOpen: isLoadOpen,
    onOpen: onLoadOpen,
    onClose: onLoadClose,
  } = useDisclosure();



   const { isOpen, onOpen, onClose } = useDisclosure();
   const [summaryData, setSummaryData] = useState(null);

  async function handleSummary(data: any) {
    // console.log(data.scanned_file_log_id);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

      try{
        const response = await fetch(
          `${baseURL}/app/reports/summary/${token}/${data.scanned_file_log_id}`,
          {
            method: "GET",
          }
        );

        const datas = await response.json();
          setSummaryData(datas);
        console.log(datas);
        onOpen();
        
      }catch(error){
        console.error("Error fetching data:", error);
      }
  }

const renderValue = (value: any): React.ReactNode => {
  if (value === null || value === undefined) {
    return "N/A"; // Fallback for null or undefined
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    if (Object.keys(value).length === 0) {
      return "N/A"; // Fallback for empty objects
    }

    return Object.entries(value).map(([subKey, subValue]) => (
      <div key={subKey}>
        <strong>{formatKey(subKey)}:</strong>{" "}
        {subValue !== null && subValue !== undefined
          ? renderValue(subValue)
          : "N/A"}
      </div>
    ));
  }

  return value; // Render primitive values directly
};

// Helper function to format camelCase keys into human-readable format
const formatKey = (key: string): string => {
  // Split camelCase into words
  const words = key.replace(/([A-Z])/g, " $1").trim();
  // Capitalize the first letter of each word
  return words
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


  return (
    <div style={{ width: "80vw", height: "60vh", maxWidth: "1250px" }}>
      <div className={styles.hello}>
        <h3>Raw Data Logs</h3>
        <p>
          Access, monitor, and manage uploaded data logs with detailed
          processing history for better transparency and control.
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
          <p style={{ fontSize: "16px", fontWeight: "600" }}>
            Uploaded Data Logs
          </p>
          {/* <Button onClick={onOpen} colorScheme="green">
            Add New User
          </Button> */}
        </div>
        <div style={{ height: "100%", width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            rowStyle={{ border: "none", outline: "none", boxShadow: "none" }}
            pagination={true}
            paginationPageSize={5}
            paginationPageSizeSelector={[5, 10, 15]}
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
            getRowHeight={function (params) {
              const description = params.data?.banner_description || "";
              const words = description.split(" ").length;
              const baseHeight = 80;
              const heightPerWord = 6;
              const minHeight = 80;
              const calculatedHeight = baseHeight + words * heightPerWord;
              return Math.max(minHeight, calculatedHeight);
            }}
            suppressCellFocus={true} // This will prevent the cell from being focused
          />
        </div>
      </div>

      <Modal isOpen={isLoadOpen} onClose={onLoadClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Loading Data Please wait... </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress isIndeterminate color="green.300" />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Battery Summary</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {summaryData && (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Field</Th>
                    <Th>Value</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.entries(summaryData).map(([key, value]) => (
                    <Tr key={key}>
                      <Td>{key}</Td>
                      <Td>{renderValue(value)} </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DataLogs;
