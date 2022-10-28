import React, { Component } from 'react';
import { CSVLink } from "react-csv";

const headers = [
  { label: "gender", key: "gender" },
  { label: "birthday", key: "birthday" },
  { label: "zipcode", key: "zipcode" },
  { label: "vaccination", key: "vaccination" },
  { label: "testresult", key: "testresult" }
];

class ResearcherCSV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.csvLinkEl = React.createRef();
  }

  downloadReport = async () => {
    const res = await fetch("http://172.25.76.159:4000/research/research");
    const data = await res.json();
    this.setState({ data: data }, () => {
      setTimeout(() => {
        this.csvLinkEl.current.link.click();
      });
    });
  }

  render() {
    const { data } = this.state;

    return (
      <div>
        <input type="button" value="Research Data" onClick={this.downloadReport} />
        <CSVLink
          headers={headers}
          filename="data.csv"
          data={data}
          ref={this.csvLinkEl}
        />
      </div>
    );
  }
}

export default ResearcherCSV;