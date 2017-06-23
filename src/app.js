var React = require('react');
var ReactDOM = require('react-dom');
require('./style.scss');


class AddButton extends React.Component {

  render() {
    return(
      <input key={"AddButton"} className="newButton" type="button" value="+" onClick={this.props.new}/>
      )
  }
}


//--------------------------------------------------------------------


class Recipe extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false
    }

    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.delete = this.delete.bind(this)
  }

  open(){
    this.setState({opened: true})
    console.log("open")
  }

  close(){
    this.setState({opened: false})
    console.log("close")
  }

  delete(){
    this.setState({opened: false})
    this.props.delete(this.props.index)
  }

  closeView() {
    return(
      <div className={"recipi"} onClick={this.open}>
        <div className={"name"}> <h1> {this.props.data.name}</h1></div>
      </div>
      )
  }

  openView() {
    let arr = []
    this.props.data.ingredients.forEach((ing, index) => {arr.push(<div className={"ingredeint"} key={index}> <h2> {ing} </h2></div> )})
    return(
      <div className={"recipi"}>
        <div  className={"name"} onClick={this.close}> <h1> {this.props.data.name} </h1> </div>
        {arr}
        <input className={"button"} type="button" value="edit" onClick={() => {this.props.edit(this.props.index)}}/>
        <input className={"button"} type="button" value="delete" onClick={this.delete}/>
      </div>
      )
  }

  render(){
    if(this.state.opened) {
      return this.openView()
    }
    else{return this.closeView()}
  }
}


//----------------------------------------------------------------------------


class Edit extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      new: false
    }
  }



  render() {
    return(
      <div className={"edit-view"}>
        <form className={"edit-form"} onSubmit={this.props.save}>
          <input className={"edit-name-input"} type="text" name={"name"} defaultValue={this.props.data.name} onChange={this.props.update} required/>
          <textarea className={"edit-ingredents-input"} rows={4} name={"ingredients"} defaultValue={this.props.data.ingredients} onChange={this.props.update} required/> <p className={"info"}>Please devide the ingredients with " , "</p>
          <input className={"button"} type="submit" value="save" />
          <input className={"button"} type="button" value="close" onClick={this.props.close}/>
        </form>
      </div>
      )
  }
}


//---------------------------------------------------------------------------


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      recipis: [{name: "Pizza", ingredients: ["Ham","Tomato","Chease"]},{name: "Pasta", ingredients: ["Spagetti","Tomato","Basil"]},{name: "Pancakes", ingredients: ["Egg","Milk","Flour"]}],
      edit: false,
      editValue: {name: "", ingredients: []},
      editIndex: -1
    }

    this.updateEditValue = this.updateEditValue.bind(this)
    this.openEditWindow = this.openEditWindow.bind(this)
    this.saveChangeFromEdit = this.saveChangeFromEdit.bind(this)
    this.closeEditWindow = this.closeEditWindow.bind(this)
    this.recipiDelete = this.recipiDelete.bind(this)

    }

  componentDidMount() {
    console.log("mount")
    if (localStorage.getItem("_matixc_recipis") !== null) {
      console.log("not null so get storage")
      let localTemp = localStorage.getItem("_matixc_recipis")
      console.log(typeof(localTemp))
      this.setState({recipis: JSON.parse(localTemp) })
    }
  }

  updateEditValue(event){
    let what = event.target.name
    let editValue = this.state.editValue
    editValue[what] = event.target.value
    this.setState({editValue: editValue})
  }

  openEditWindow(index) {
    let valueForEdit = {}
    if(index > -1){
      valueForEdit = {name: this.state.recipis[index].name, ingredients: this.state.recipis[index].ingredients.join(",")}
    }
    this.setState({edit:true, editValue: valueForEdit, editIndex: index})
  }

  saveChangeFromEdit(evt) {
    evt.preventDefault()
    let tempRecipis = this.state.recipis
    let index = this.state.editIndex
    if(index > -1) {
    tempRecipis[index].name = this.state.editValue.name
    tempRecipis[index].ingredients = this.state.editValue.ingredients.split(",")
    }
    else{
      tempRecipis.push({name: this.state.editValue.name, ingredients: this.state.editValue.ingredients.split(",")})
    }
    this.setState({recipis: tempRecipis, edit:false, editValue: {name: "", ingredients: []},
      editIndex: -1})
    localStorage.setItem("_matixc_recipis", JSON.stringify(this.state.recipis))
  }

  closeEditWindow() {
    this.setState({edit:false, editValue: {name: "", ingredients: []},
      editIndex: -1})
  }

  recipiDelete(index){
    let edit = this.state.recipis
    console.log(edit)
    edit.splice(index,1)
    console.log(edit)
    this.setState({recipis: edit})
     localStorage.setItem("_matixc_recipis", JSON.stringify(edit))
  }

  render() {
    let arr = []
    this.state.recipis.forEach((data, index) => {
      arr.push(<Recipe key={index} data={data} index={index} delete={this.recipiDelete} edit={this.openEditWindow}/>)
    })

    if(this.state.edit) {
      return(
        <div className="container">
          {arr}
          <Edit
            data={this.state.editValue}
            index={this.state.editIndex}
            close={this.closeEditWindow}
            update={this.updateEditValue}
            save={this.saveChangeFromEdit}
          />
          <AddButton new={this.openEditWindow}/>
        </div>
      )
    }
    else {
      return(
        <div className="container">
          {arr}
          <AddButton new={this.openEditWindow}/>
        </div>
      )
    }
  }
}

ReactDOM.render(<App />, document.getElementById("target"));

