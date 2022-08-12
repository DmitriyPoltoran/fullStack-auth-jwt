import React, { useContext, useEffect, useState } from "react";
import { Context } from ".";
import LoginForm from "./components/LoginForm";
import { observer } from "mobx-react-lite";
import { IUser } from "./models/IUser";
import { UserService } from "./services/UserService";

function App() {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  if (store.isLoading) {
    return <div>Loading...</div>;
  }

  if (!store.isAuth) {
    return (
      <>
        <h1>LOG IN</h1>
        <LoginForm />
      </>
    );
  }

  return (
    <div className="App">
      <h1>{`User authorized ${store.user.email}`}</h1>
      <h1>
        {store.user.isActivated
          ? "Account confirmed on email"
          : "Confirm account on email"}
      </h1>
      <button onClick={() => store.logout()}>Log out</button>
      <div>
        <button onClick={getUsers}>Get users</button>
      </div>
      {users.map((user) => (
        <div key={user.email}>{user.email}</div>
      ))}
    </div>
  );
}

export default observer(App);
