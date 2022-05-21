import axios from 'axios';
import React, { Component } from 'react'
import '../App.css';
export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageArray: []
        };
        this.inputRef = React.createRef();
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput = () => {
        let searchTerm = this.inputRef.current.value;
        axios({
            method: 'get',
            url: 'https://api.flickr.com/services/rest',
            params: {
                method: 'flickr.photos.search',
                api_key: 'your_api_key',
                text: searchTerm,
                page: 1,
                format: 'json',
                nojsoncallback: 1,
                per_page: 12,
            }
        })
            .then(res => res.data)
            .then(data => {
                const storeImages = data.photos.photo.map(image => {
                    let imageSrc = `https://farm${image.farm}.static.flickr.com/${image.server}/${image.id}_${image.secret}.jpg`
                    return (
                        <img key={image.id} src={imageSrc} alt={image.id} height="200" width="300" />
                    )
                })
                this.setState({
                    imageArray: storeImages
                });
            })
            .catch(err => {
                this.setState({
                    imageArray: []
                });
            })
    }

    render() {
        const debounce = (fn, delay) => {
            let debounceTimer = 0;
            return function () {
                let context = this, args = arguments;
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => fn.apply(context, args), delay);
            }
        }

        const inputHelper = debounce(this.handleInput, 1000);

        return (
            <>
                <div className='container'>
                    <h1>{this.props.branding}</h1>
                    <input
                        type="text"
                        placeholder="photos, people, groups"
                        ref={this.inputRef}
                        onChange={() => inputHelper()}
                    />
                    <div className='button-group'>
                        <button>Login</button>
                        <button>Signup</button>
                    </div>
                </div>
                <div className='main-container'>
                    {this.state.imageArray && this.state.imageArray.length > 0 ? this.state.imageArray : null}
                </div>
            </>
        )
    }
}
