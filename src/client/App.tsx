import { useCallback, useState } from "react";

type CertificateResponse = {
  subject: string
  studentName: string
  date: string
  signatureName: string
  image: string
}

function App() {
  const [errors, setErrors] = useState<string[] | undefined>()
  const [certificate, setCertificate] = useState<CertificateResponse | undefined>()

  const handleFormSubmit = useCallback(async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    setErrors(undefined)

    try {
      const formData = new FormData(ev.currentTarget)
      const generateCertificate = await fetch("http://localhost:3000/api/certificates", {
        method: "post",
        body: formData,
      })

      const jsonResponse = await generateCertificate.json()
      if (!generateCertificate.ok) {
        const errorResponse = jsonResponse as { messages: string[] }
        if (errorResponse.messages.length > 0) {
          setErrors(errorResponse.messages)
        }
        return
      }

      const certificateData: CertificateResponse = jsonResponse
      setCertificate(certificateData)
    } catch (error) {
      setErrors(["Unexpected error"])
    }
  }, [])

  return (
    <div className="App">
      <div>
        <header>
          <h1>Certificates</h1>
        </header>
        <div className="flex">
          <div className="column form-container">
            <form onSubmit={handleFormSubmit}>
              {errors && errors.length > 0 && (
                <div className="flash danger">
                  <p>There were problems with the submission:</p>
                  <ul>
                    {errors.map(error => <li>{error}</li>)}
                  </ul>
                </div>
              )}

              <p>
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" />
              </p>

              <p>
                <label htmlFor="studentName">Student Name</label>
                <input type="text" id="studentName" name="studentName" />
              </p>

              <p>
                <label htmlFor="date">Date</label>
                <input type="date" id="date" name="date" />
              </p>

              <p>
                <label htmlFor="signatureName">Signature Name</label>
                <input type="text" id="signatureName" name="signatureName" />
              </p>

              <p>
                <label htmlFor="image">Image</label>
                <input type="file" id="image" name="image" />
              </p>

              <p>
                <button type="submit">Generate</button>
              </p>
            </form>
          </div>

          <div className="column p-5">
            {certificate && <>
              <div>
                <h2>Result</h2>
                <p>
                  <strong>Subject:</strong> {certificate.subject}
                </p>
                <p>
                  <strong>Student Name:</strong> {certificate.studentName}
                </p>
                <p>
                  <strong>Date:</strong> {certificate.date}
                </p>
                <p>
                  <strong>Signature Name:</strong> {certificate.signatureName}
                </p>
                <p>
                  <strong>Image:</strong>
                  <img src={certificate.image} alt="" />
                </p>
              </div>
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
