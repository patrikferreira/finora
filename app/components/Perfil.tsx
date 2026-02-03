import LogoutButton from "./LogoutButton";
import Profile from "./Profile";

export default function Perfil() {
    return (
        <div className="rounded-xl bg-(--color-light) flex flex-col gap-3 p-3">
            <Profile />
            <LogoutButton />
        </div>
    )
}