import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function EmployeePage({ employee, onBack }) {
  const [documents, setDocuments] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("");
  const fileInputRef = useRef(null);

  const documentTypes = [
    "Pan Card", "Aadhar Card", "Passport", "Degree", "Certificate",
    "Employment Form", "HR & IT Details", "Reference ID", "Bank Account Details",
    "10th Mark Sheet", "12th Mark Sheet", "Other Certificates"
  ];

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/documents/${employee.employee_id}`);
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  }, [employee.employee_id]);

  const fetchAllDocuments = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/all-documents`);
      setAllDocuments(response.data);
    } catch (error) {
      console.error("Error fetching all employees' documents:", error);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
    fetchAllDocuments();
    
  }, [fetchDocuments, fetchAllDocuments]);

  const handleUpload = async () => {
    if (!file || !docType) {
      alert("Please select both a file and document type.");
      return;
    }

    const alreadyUploaded = documents.some(doc => doc.document_type === docType);
    if (alreadyUploaded) {
      alert(`A document is already uploaded for ${docType}. Please delete it first.`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("employee_id", employee.employee_id);
    formData.append("document_type", docType);

    try {
      await axios.post("http://localhost:5000/upload-document", formData);
      setFile(null);
      setDocType("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchDocuments();
      fetchAllDocuments();
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await axios.delete(`http://localhost:5000/delete-document/${id}`);
        fetchDocuments();
        fetchAllDocuments();
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      window.location.href = "/";
    }
  };

  const handleDownloadStatus = () => {
    const status = {};
    documentTypes.forEach(type => {
      const uploaded = documents.some(doc => doc.document_type === type);
      status[type] = uploaded ? "✅" : "❌";
    });

    const worksheetData = [
      ["Employee Name", "Employee ID", ...documentTypes],
      [employee.name, employee.employee_id, ...documentTypes.map(type => status[type])]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    // Set column widths
    worksheet['!cols'] = [
      { wch: 20 }, // Employee Name
      { wch: 15 }, // Employee ID
      ...documentTypes.map(() => ({ wch: 20 })) // Each document type
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Status");

    XLSX.writeFile(workbook, `${employee.name.replace(" ", "_")}_Status.xlsx`);
  };

  const handleDownloadAllStatus = () => {
    const employeeMap = {};

    allDocuments.forEach(doc => {
      if (!employeeMap[doc.employee_id]) {
        employeeMap[doc.employee_id] = {
          name: doc.employee_name,
          documents: {}
        };
      }
      if (doc.document_type) {
        employeeMap[doc.employee_id].documents[doc.document_type] = "✅";
      }
    });

    const worksheetData = [
      ["Employee Name", "Employee ID", ...documentTypes]
    ];

    Object.keys(employeeMap).forEach(id => {
      const emp = employeeMap[id];
      const row = [
        emp.name,
        id,
        ...documentTypes.map(type => emp.documents[type] || "❌")
      ];
      worksheetData.push(row);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 20 }, // Employee Name
      { wch: 15 }, // Employee ID
      ...documentTypes.map(() => ({ wch: 20 })) // Each document type
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Status");

    XLSX.writeFile(workbook, `All_Employees_Status.xlsx`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInfo}>
          <div style={styles.row}>
            <div style={styles.label}>Employee Name :</div>
            <div style={styles.infoBox}>{employee.name}</div>
          </div>
          <div style={styles.row}>
            <div style={styles.label}>ID Number :</div>
            <div style={styles.infoBox}>{employee.employee_id}</div>
          </div>
        </div>
        <button style={styles.button} onClick={handleDownloadStatus}>
          Download Status
        </button>
      </div>

      {/* Upload Section */}
      <div style={styles.uploadSection}>
        <select value={docType} onChange={e => setDocType(e.target.value)} style={styles.input}>
          <option value="">Select Document</option>
          {documentTypes.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>
        <input
          ref={fileInputRef}
          type="file"
          onChange={e => setFile(e.target.files[0])}
          style={styles.fileInput}
        />
        <button style={styles.button} onClick={handleUpload}>Upload</button>
      </div>

      {/* Documents List */}
      <div style={styles.documentList}>
        {documents.length === 0 ? (
          <div style={{ color: "white" }}></div>
        ) : (
          documents.map(doc => (
            <div key={doc.id} style={styles.documentItem}>
              <span style={{ flex: 1 }}>{doc.document_type}</span>
              <a
                href={`http://localhost:5000/${doc.file_path}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button style={styles.button}>Download</button>
              </a>
              <button
                style={{ ...styles.button, marginLeft: "10px" }}
                onClick={() => handleDelete(doc.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer Buttons */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={onBack}>Back</button>
        <button style={styles.button} onClick={handleExit}>Exit</button>
        <button style={styles.button} onClick={handleDownloadAllStatus}>Download All Status</button>
      </div>
      {/* --- Updated Footer --- */}
     <div style={footerStyles.footer}>
        <div style={footerStyles.footerLeft}>
          <div style={footerStyles.logoAboveName}>
            <img src="/sketch.png" alt="Logo" style={footerStyles.logo} />
            <div style={footerStyles.companyName}>SKETCHCOM Engineering & Design Pvt. Ltd.</div>
          </div>
          <div style={footerStyles.subText}>Faridabad – Mumbai – Bangalore – Dubai (UAE)</div>
          <div style={footerStyles.subText}>www.sketchconsultant.in | info@sketchconsultant.co.in</div>
          <div style={footerStyles.subText}>Mobile / WhatsApp: +91-9711079859</div>
        </div>

        <div style={footerStyles.footerCenter}>
          <h1 style={{ fontSize: "36px", fontWeight: "bold", margin: "0" }}>Employee Database</h1>
          <h1 style={{ fontSize: "36px", fontWeight: "bold", margin: "0" }}>Portal</h1>
        </div>

        <div style={footerStyles.footerRight}>
          <img src="crop_image.png" alt="Certificates" style={{ maxWidth: "260px", height: "auto" }} />
        </div>
      </div>
    </div>
    
  );
}

// Styles
const styles = {
  container: {
    backgroundColor: "#cc4422",
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  header: {
    color: "white",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  headerInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  label: {
    color: "white",
    fontWeight: "bold",
    minWidth: "120px"
  },
  infoBox: {
    backgroundColor: "lightgray",
    color: "gray",
    border: "1px solid gray",
    borderRadius: "4px",
    padding: "4px 8px",
    fontSize: "14px",
    fontWeight: "bold",
    minWidth: "120px",
    textAlign: "center"
  },
  uploadSection: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center"
  },
  input: {
    width: "300px",
    height: "30px",
    border: "2px inset gray",
    backgroundColor: "lightgray",
    marginRight: "10px"
  },
  fileInput: {
    marginLeft: "10px",
    marginRight: "10px"
  },
  button: {
    backgroundColor: "gray",
    color: "white",
    border: "2px outset darkgray",
    padding: "5px 15px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  documentList: {
    marginTop: "20px",
    flexGrow: 1
  },
  documentItem: {
    marginBottom: "15px",
    color: "white",
    display: "flex",
    alignItems: "center"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "30px",
    gap: "10px"
  }
};

const footerStyles = {
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 30px",
    backgroundColor: "#ffffff",
    borderTop: "20px solid #ccc",
    fontFamily: "Arial, sans-serif",
    flexWrap: "wrap",
    height: "200px"
  },
  footerLeft: {
    flex: 1,
    textAlign: "center",
    color: "#555",
    fontSize: "14px",
    lineHeight: "1.4",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  logoAboveName: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "5px"
  },
  logo: {
    width: "80px",
    height: "80px",
    marginBottom: "5px"
  },
  companyName: {
    fontWeight: "bold",
    fontSize: "18px",
    color: "#333",
    whiteSpace: "nowrap",
    textAlign: "center"
  },
  subText: {
    margin: "2px 0",
    fontSize: "13px",
    color: "#777",
  },
  footerCenter: {
    flex: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "black",
    textAlign: "center"
  },
  footerRight: {
    flex: 1,
    textAlign: "right",
  }
};
