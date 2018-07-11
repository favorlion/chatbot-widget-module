import React from 'react';
import './index.css';

class TableHolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
  }

  render() {

  const tableContent = this.props.table;

  const tableRow = tableContent.map((table) =>{
    return <tr>
      <td className="Table-name">{table.name}</td>
      <td className="Table-value">{table.value}</td>
    </tr>;
  });


  return <table className="Table-carousel">{tableRow}</table>;
  // return <table className="Table">
  //   {tableElements}
  // </table>;
  }
}

export default TableHolder;
