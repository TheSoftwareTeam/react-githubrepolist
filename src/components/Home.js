import React, { useState, useEffect, useRef } from "react";
import { GoMarkGithub } from "react-icons/go";
import { Container, Topbar, Title, RepoList } from "../styles";
import { Row, Col, Card } from "reactstrap";
import Repo from "../components/Repo/Repo";
import Todo from "../components/ToDo/ToDo";
import { supabase } from "./Client/client";

function Home() {
  const [userDetail, setUser1] = useState(null);
  const [user, setUser] = useState({
    prof: {},
    repos: [],
  });
  const ref = useRef(null);

  useEffect(() => {
    checkUser();
    window.addEventListener("hashchange", function () {
      checkUser();
    });

    setTimeout(() => {
      ref.current.click();
    }, 500);
  }, []);

  //Kullanıcı giriş kontrol
  async function checkUser() {
    const userDetail = supabase.auth.user();
    setUser1(userDetail);
  }

  //Giriş yap
  async function signInWithGithub() {
    await supabase.auth.signIn({
      provider: "github",
    });
  }
  //Çıkış yap
  async function signOut() {
    await supabase.auth.signOut();
    setUser1(null);
  }

  async function getData() {
    search();
  }

  //Github repo çekme
  async function getApiData() {
    const [prof, repos] = await Promise.all([
      fetch(
        `https://api.github.com/users/${userDetail.user_metadata.user_name}`
      ).then((response) => response.json()),
      fetch(
        `https://api.github.com/users/${userDetail.user_metadata.user_name}/repos`
      ).then((response) => response.json()),
    ]);
    return { prof, repos };
  }

  async function search() {
    const { prof, repos } = await getApiData();

    if (prof.message === "Not Found") {
      userDetail.user_metadata.user_name.focus();
    } else {
      setUser({
        prof,
        repos,
      });
    }
  }

  if (userDetail) {
    console.log(user);
    console.log(userDetail);
    return (
      <Container>
        <button className="btnSignOut" onClick={signOut}>
          Sign out
        </button>

        <Topbar>
          <Title>ListRepos</Title>

          {/* Verileri getir */}
          <button className="dataBtn" ref={ref} onClick={getData}></button>

          <GoMarkGithub size="40px" color="#eee" />
        </Topbar>

        {user.prof.id && (
          <>
            <Row>
              <Col sm="5">
                <Card body className="card1">
                  <h2>My GitHub Repos</h2>
                  <RepoList>
                    {user.repos.map((r) => (
                      <li className="repo" key={r.id}>
                        <Repo repo={r} />
                      </li>
                    ))}
                  </RepoList>
                </Card>
              </Col>

              {/* Todo */}
              <Todo />
            </Row>
          </>
        )}
      </Container>
    );
  } else {
    return (
      <div className="App">
        <h2 className="todoText">React GitHub Todo List </h2>
        <button className="btnSignIn" onClick={signInWithGithub}>
          {" "}
          <GoMarkGithub className="githubIcon" size="40px" /> Sign in with
          GitHub
        </button>
      </div>
    );
  }
}
export default Home;
