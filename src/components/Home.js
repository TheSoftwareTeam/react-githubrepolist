import React, { useState, useEffect } from "react";
import { GoMarkGithub } from "react-icons/go";
import { Container, Topbar, Title, RepoList } from "../styles";
import { Row, Col, Card } from "reactstrap";
import { Router, Route, BrowserRouter } from "react-router";
import Repo from "../components/Repo/Repo";
import Todo from "../components/ToDo/ToDo";
import { supabase } from "./Client/client";

function Home() {




  const [userDetail, setUser1] = useState(null);
  const [user, setUser] = useState({
    prof: {},
    repos: [],
  });

  useEffect(() => {
    checkUser();
    window.addEventListener("hashchange", function () {
      checkUser();
    });
  }, []);
  async function checkUser() {
    const userDetail = supabase.auth.user();
    setUser1(userDetail);
  }
  async function signInWithGithub() {
    await supabase.auth.signIn({
      provider: "github",
    });
  }
  async function signOut() {
    await supabase.auth.signOut();
    setUser1(null);
  }

  async function getData() {
    search();
  }

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
        <button className="outBtn" onClick={signOut}>
          Sign out
        </button>

        <Topbar>
          <Title>ListRepos</Title>
          <button className="dataBtn" onClick={getData}>
            Verileri Getir
          </button>
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
              
                  <Todo />
              
            </Row>
          </>
        )}
      </Container>
    );
  } else {
    return (
      <div className="App">
        <h1>Hello, please sign in!</h1>
        <button onClick={signInWithGithub}>Sign In</button>
      </div>
    );
  }
}
export default Home;