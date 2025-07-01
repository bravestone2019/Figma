import Download from "../../../assets/Generate/upload.png";

const download = () => {
  return (
    <div className="upload-bar">
      <img src={Download} alt={Download} className="upload-icon" />
      <span className="uploadtip">
        Submit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ctrl+shift+a
      </span>
    </div>
  );
};

export default download;
