import AuthForm from "../components/Form";

export default function RegisterPersonalA() {
  return (
    <div className="flex flex-1 justify-center items-center w-full h-screen">
      <AuthForm route="api/user/register" method="register" />
    </div>
  )
}
