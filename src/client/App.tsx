import { useCallback, useState } from "react";
import { InputField } from "./components/InputField";
import { Errors } from "./components/Errors";
import { CertificateResult } from "./components/CertificateResult";
import { SelectField, SelectOption } from "./components/SelectField";
import { APIError, useAPIClient } from "./contexts/APIClientContext";

type Mode = "default" | "upload"

type Form = {
  subject: string,
  studentName: string,
  date: string,
  signatureName: string,
  image: string
}

type State = {
  errors: string[] | undefined,
  certificate: { result: string, fileName: string } | undefined,
  requestType: Mode
  form: Form
}

const modeOptions: SelectOption<Mode>[] = [
  { value: "default", label: "Default Request" },
  { value: "upload", label: "With Upload" },
]

function App() {
  const [state, setState] = useState<State>({
    errors: undefined,
    certificate: undefined,
    requestType: "default",
    form: {
      subject: "",
      studentName: "",
      date: "",
      signatureName: "",
      image: ""
    }
  })
  const apiClient = useAPIClient()

  const handleFormSubmit = useCallback(async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    setState((state) => {
      return {
        ...state,
        errors: undefined
      }
    })

    try {
      if (state.requestType == "default") {
        const certificate = await apiClient.postCertificates(state.form)
        setState((state) => ({
          ...state, certificate: { result: certificate.response, fileName: certificate.meta.name }
        }))
        return
      }

      const formData = new FormData(ev.currentTarget)
      const image = formData.get("image")
      if (!image || !(image instanceof Blob)) {
        setState(state => ({ ...state, errors: ["Image not selected"] }))
        return
      }
      const certificate = await apiClient.postCertificatesWithUpload(state.form, image)

      setState((state) => ({
        ...state, certificate: { result: certificate.response, fileName: certificate.meta.name }
      }))
    } catch (error) {
      const apiError = error as APIError
      if ("messages" in apiError) {
        setState((state) => ({ ...state, errors: apiError.messages }))
        return
      }

      console.error("Unexpected error", error)
      setState((state) => ({ ...state, errors: ["Unexpected error"] }))
    }
  }, [state.form, state.requestType])

  const updateRequestType = useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
    setState((state) => ({ ...state, requestType: ev.target.value as Mode }))
  }, [])

  const updateFormField = useCallback((field: keyof Form) => {
    return (ev: React.ChangeEvent<HTMLInputElement>) => {
      setState(state => ({
        ...state,
        form: {
          ...state.form,
          [field]: ev.target.value
        }
      }))
    }
  }, [])

  return (
    <div className="App">
      <header>
        <h1>Certificates</h1>
      </header>
      <div>
        <div>
          <form onSubmit={handleFormSubmit}>
            <Errors errors={state.errors} />

            <SelectField
              options={modeOptions}
              name="mode"
              value={state.requestType}
              id="mode"
              label="Request Type"
              onChange={updateRequestType} />

            <InputField name="subject" id="subject" label="Subject" type="text" onChange={updateFormField("subject")} />

            <InputField name="studentName" id="studentName" label="Student Name" type="text" onChange={updateFormField("studentName")} />

            <InputField name="date" id="date" label="Date" type="date" onChange={updateFormField("date")} />

            <InputField name="signatureName" id="signatureName" label="Signature Name" type="text" onChange={updateFormField("signatureName")} />

            {state.requestType === "default" && <InputField name="image" id="image" label="Image URL" type="text" onChange={updateFormField("image")} />}

            {state.requestType === "upload" && <InputField name="image" id="image" label="Image" type="file" />}

            <p>
              <button type="submit">Generate</button>
            </p>
          </form>

        </div>

        <CertificateResult certificate={state.certificate?.result} fileName={state.certificate?.fileName} />
      </div>
    </div>
  );
}

export default App
