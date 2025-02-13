export const Loading: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) {
    return
  }

  return <div className="loading"></div>
}
