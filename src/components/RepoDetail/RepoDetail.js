import React from "react";
import "./RepoDetail.css";
import { Card, ListGroup, ListGroupItem } from "reactstrap";

export default function RepoDetail() {
  return (
    <ListGroup className="list-group" numbered>
      <ListGroupItem>Cras justo odio</ListGroupItem>
      <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
      <ListGroupItem>Morbi leo risus</ListGroupItem>
      <ListGroupItem>Porta ac consectetur ac</ListGroupItem>
      <ListGroupItem>Vestibulum at eros</ListGroupItem>

      <ListGroupItem>
        <Card>
          <form onSubmit={(e) => this.handleNewTask(e)}>
            <div className="form-group">
              <textarea
                name="description"
                className="form-control"
                placeholder="Task description"
              ></textarea>
              <button type="submit" className="btn btn-primary btn-block">
                Add
              </button>
            </div>
          </form>
        </Card>
      </ListGroupItem>
    </ListGroup>
  );
}
