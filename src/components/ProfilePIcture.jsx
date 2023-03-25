const ProfilePicture = (props) => {
  const { url } = props;
  return (
    <div className="profile-picture">
      <img
        src={url}
        style={{ objectFit: "contain", width: "100px", height: "100px" }}
      />
    </div>
  );
};

export default ProfilePicture;
