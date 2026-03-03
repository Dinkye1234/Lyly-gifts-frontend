const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://lyly-gifts-backend.onrender.com/api/auth/reset-password/${token}`,
        { password },
      );
      alert("Амжилттай! Одоо шинэ нууц үгээрээ нэвтэрнэ үү.");
      navigate("/login");
    } catch (err) {
      alert("Алдаа гарлаа");
    }
  };

  return (
    <form onSubmit={handleReset}>
      <h2>Шинэ нууц үг тохируулах</h2>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Шинэ нууц үг"
      />
      <button type="submit">Хадгалах</button>
    </form>
  );
};
