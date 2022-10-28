import React, { Component } from 'react';
import { CSVLink } from "react-csv";

const headers = [
  { label: "gender", key: "gender" },
  { label: "date of birth", key: "date of birth" },
  { label: "zipcode", key: "zipcode" },
  { label: "vaccination history", key: "vaccination history" },
  { label: "recent test result", key: "recent test result" }
];

class ResearcherCSV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.csvLinkEl = React.createRef();
  }
 

  getMedicalHistory = () => {
    return fetch('http://172.25.76.159:4000/research/researchdata')
      .then(res => res.json());
  }

  downloadReport = async () => {
    const res = await fetch("http://172.25.76.159:4000/research/researchdata");
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