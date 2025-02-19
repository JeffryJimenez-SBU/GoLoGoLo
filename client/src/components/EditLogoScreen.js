import React, { Component } from "react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import WorkSpace from "./WorkSpace";
import Text from "./editScreenLayout/Text";
import Image from "./editScreenLayout/Images";

const GET_LOGO = gql`
  query logo($logoId: String) {
    logo(_id: $logoId) {
      _id
      text {
        text
        color
        size
        x
        y
      }
      backgroundColor
      borderColor
      borderRadius
      borderWidth
      padding
      margins
      width
      height
      img {
        url
        x
        y
        height
        width
      }
      lastUpdate
    }
  }
`;

const UPDATE_LOGO = gql`
  mutation updateLogo(
    $id: String!
    $text: [TextInput!]
    $backgroundColor: String!
    $borderColor: String!
    $borderRadius: Int!
    $borderWidth: Int!
    $padding: Int!
    $margins: Int!
    $width: Int!
    $height: Int!
    $img: [ImageInput]
  ) {
    updateLogo(
      _id: $id
      text: $text
      backgroundColor: $backgroundColor
      borderColor: $borderColor
      borderRadius: $borderRadius
      borderWidth: $borderWidth
      padding: $padding
      margins: $margins
      width: $width
      height: $height
      img: $img
    ) {
      lastUpdate
    }
  }
`;

class EditLogoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = undefined;
  }

  onChange = (e, data) => {
    data.logo[e.target.name] = e.target.value;
    this.setState({});
  };

  textUpdate = (text, index, data) => {
    data.logo.text[index] = text;
    this.setState({});
  };

  ImageUpdate = (img, index, data) => {
    data.logo.img[index] = img;
    this.setState({});
  };

  changeXY = (x, y, index, form) => {
    let texts = form.logo.text;
    texts[index].x = x;
    texts[index].y = y;

    form.logo.text = texts;

    this.setState({});
  };

  imgXY = (x, y, index, form) => {
    let images = form.logo.img;
    images[index].x = x;
    images[index].y = y;

    form.logo.img = images;

    this.setState({});
  };

  changeImgSize = (height, width, index, form) => {
    let images = form.logo.img;
    images[index].height = height;
    images[index].width = width;

    form.logo.img = images;

    this.setState({});
  };

  addText = (data) => {
    const dummy = { text: "John Doe", color: "#ffffff", size: 24, x: 0, y: 0 };
    const texts = [...data.logo.text, dummy];
    data.logo.text = texts;
    this.setState({});
  };

  addImage = (data) => {
    const dummy = { url: "", x: 0, y: 0 };
    const images = [...data.logo.img, dummy];
    data.logo.img = images;
    this.setState({});
  };

  update = () => {
    this.setState({});
  };

  moveText = (pos, destination, data) => {
    if (destination < 0) {
      console.log("destination: ", destination);
    } else if (destination > data.logo.text.length - 1) {
      console.log("destination: ", destination);
    } else {
      console.log("Before Change: ", data.logo.text);
      const texts = [...data.logo.text];

      const textObj = Object.assign({}, texts[pos]);
      texts[pos] = Object.assign({}, texts[destination]);
      texts[destination] = Object.assign({}, textObj);

      data.logo.text = [...texts];
      console.log("After Change: ", data.logo.text);
    }

    this.setState({});
  };
  moveImage = (pos, destination, data) => {
    if (destination < 0) {
      console.log("destination: ", destination);
    } else if (destination > data.logo.img.length - 1) {
      console.log("destination: ", destination);
    } else {
      console.log("Before Change: ", data.logo.img);
      const images = [...data.logo.img];

      const imgObj = Object.assign({}, images[pos]);
      images[pos] = Object.assign({}, images[destination]);
      images[destination] = Object.assign({}, imgObj);

      data.logo.img = [...images];
      console.log("After Change: ", data.logo.img);
    }

    this.setState({});
  };

  render() {
    let backgroundColor,
      borderColor,
      borderRadius,
      borderWidth,
      padding,
      margins,
      height,
      width;
    return (
      <Query
        query={GET_LOGO}
        variables={{ logoId: this.props.match.params.id }}
        fetchPolicy={"no-cache"}
      >
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;

          return (
            <Mutation
              mutation={UPDATE_LOGO}
              key={data.logo._id}
              onCompleted={() => this.props.history.push(`/`)}
            >
              {(updateLogo, { loading, error }) => (
                <div className='container'>
                  <div className='panel panel-default'>
                    <div className='panel-heading'>
                      <h3 className='panel-title'>Edit Logo</h3>
                    </div>
                    <div className='row'>
                      <div className='col-' style={{ marginRight: "35px" }}>
                        <div className='panel-body'>
                          <button
                            className='btn btn-primary'
                            onClick={() => this.addText(data)}
                          >
                            Add Text
                          </button>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              updateLogo({
                                variables: {
                                  id: data.logo._id,
                                  text: data.logo.text.map((obj) => {
                                    const { __typename, ...other } = obj;
                                    const size = parseInt(other.size);
                                    const x = parseInt(other.x);
                                    const y = parseInt(other.y);
                                    other.size = size;
                                    other.x = x;
                                    other.y = y;
                                    return other;
                                  }),
                                  backgroundColor: backgroundColor.value,
                                  borderColor: borderColor.value,
                                  borderRadius: parseInt(borderRadius.value),
                                  borderWidth: parseInt(borderWidth.value),
                                  padding: parseInt(padding.value),
                                  margins: parseInt(margins.value),
                                  width: parseInt(width.value),
                                  height: parseInt(height.value),
                                  img: data.logo.img.map((obj) => {
                                    const { __typename, ...other } = obj;
                                    const x = parseInt(other.x);
                                    const y = parseInt(other.y);
                                    const width = parseInt(other.width);
                                    const height = parseInt(other.height);

                                    other.x = x;
                                    other.y = y;
                                    other.width = width;
                                    other.height = height;
                                    return other;
                                  }),
                                },
                              });

                              backgroundColor = "";
                              borderColor = "";
                              borderRadius = "";
                              borderWidth = "";
                              padding = "";
                              margins = "";
                              width = "";
                              height = "";
                            }}
                          >
                            {data.logo.text.map((obj, index) => (
                              <Text
                                data={obj}
                                index={index}
                                callback={this.textUpdate}
                                updateState={this.update}
                                form={data}
                                move={this.moveText}
                              />
                            ))}
                            <div className='form-group'>
                              <label htmlFor='backgroundColor'>
                                background Color:
                              </label>
                              <input
                                type='color'
                                className='form-control'
                                name='backgroundColor'
                                onChange={(e) => this.onChange(e, data)}
                                ref={(node) => {
                                  backgroundColor = node;
                                }}
                                placeholder='Background Color'
                                defaultValue={data.logo.backgroundColor}
                              />
                            </div>
                            <div className='form-group'>
                              <label htmlFor='borderColor'>Border Color:</label>
                              <input
                                type='color'
                                className='form-control'
                                name='borderColor'
                                onChange={(e) => this.onChange(e, data)}
                                ref={(node) => {
                                  borderColor = node;
                                }}
                                placeholder='Border Color'
                                defaultValue={data.logo.borderColor}
                              />
                            </div>
                            <div className='form-group'>
                              <label htmlFor='borderRadius'>
                                Border Radius:
                              </label>
                              <input
                                type='number'
                                className='form-control'
                                name='borderRadius'
                                onChange={(e) => this.onChange(e, data)}
                                ref={(node) => {
                                  borderRadius = node;
                                }}
                                placeholder='Background Radius'
                                defaultValue={data.logo.borderRadius}
                                min='0'
                                max='144'
                                required
                              />
                            </div>
                            <div className='form-group'>
                              <label htmlFor='borderWidth'>Border Width:</label>
                              <input
                                type='number'
                                className='form-control'
                                name='borderWidth'
                                onChange={(e) => this.onChange(e, data)}
                                ref={(node) => {
                                  borderWidth = node;
                                }}
                                placeholder='Border Width'
                                defaultValue={data.logo.borderWidth}
                                min='0'
                                max='144'
                                required
                              />
                            </div>
                            <div className='form-group'>
                              <label htmlFor='padding'>Padding:</label>
                              <input
                                type='number'
                                className='form-control'
                                name='padding'
                                onChange={(e) => this.onChange(e, data)}
                                ref={(node) => {
                                  padding = node;
                                }}
                                placeholder='Padding'
                                defaultValue={data.logo.padding}
                                min='0'
                                max='144'
                                required
                              />
                            </div>

                            <div className='form-group'>
                              <label htmlFor='margins'>Margins:</label>
                              <input
                                type='number'
                                className='form-control'
                                name='margins'
                                onChange={(e) => this.onChange(e, data)}
                                ref={(node) => {
                                  margins = node;
                                }}
                                placeholder='Margins'
                                defaultValue={data.logo.margins}
                                min='0'
                                max='144'
                                required
                              />
                            </div>
                            <div className='form-group'>
                              <label htmlFor='borderWidth'>Logo Width:</label>
                              <input
                                type='number'
                                className='form-control'
                                name='width'
                                onChange={(e) => this.onChange(e, data)}
                                ref={(node) => {
                                  width = node;
                                }}
                                placeholder='Logo Width'
                                defaultValue={data.logo.width}
                                min='0'
                                required
                              />
                            </div>

                            <div className='form-group'>
                              <label htmlFor='borderWidth'>Logo Height:</label>
                              <input
                                type='number'
                                className='form-control'
                                name='height'
                                onChange={(e) => this.onChange(e, data)}
                                ref={(node) => {
                                  height = node;
                                }}
                                placeholder='Logo height'
                                defaultValue={data.logo.height}
                                min='0'
                                required
                              />
                            </div>
                            <button
                              className='btn btn-primary'
                              style={{
                                marginRight: "20px",
                                marginBottom: "10px",
                                marginTop: "5px",
                              }}
                              type='button'
                              onClick={() => this.addImage(data)}
                            >
                              Add Image
                            </button>

                            {data.logo.img &&
                              data.logo.img.map((obj, index) => (
                                <Image
                                  data={obj}
                                  index={index}
                                  callback={this.ImageUpdate}
                                  updateState={this.update}
                                  form={data}
                                  move={this.moveImage}
                                />
                              ))}

                            <button
                              style={{
                                marginRight: "20px",
                                marginBottom: "10px",
                                marginTop: "5px",
                              }}
                              type='submit'
                              className='btn btn-success'
                            >
                              Submit
                            </button>
                          </form>
                          {loading && <p>Loading...</p>}
                          {error && <p>Error :( Please try again</p>}
                        </div>
                      </div>
                      <WorkSpace
                        data={data}
                        changeXY={this.changeXY}
                        imgXY={this.imgXY}
                        changeImgSize={this.changeImgSize}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default EditLogoScreen;
