interface CertificateResultProps {
  certificate: string | undefined,
  fileName: string | undefined
}

export const CertificateResult: React.FC<CertificateResultProps> = ({ certificate, fileName }) => {
  if (!certificate || certificate === "") {
    return
  }
  if (!fileName || fileName === "") {
    fileName = "certificate.pdf"
  }
  const dataURL = `data:application/pdf;base64,${certificate}`

  return (
    <div className="certificate-result">
      <h2>Result</h2>
      <a download={fileName} href={dataURL}>Download</a>
      <object data={dataURL} type="application/pdf" name="Certificate"></object>
    </div>
  )
}
