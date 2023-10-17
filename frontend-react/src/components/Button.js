export default function Button(props){
    function loading(){
        console.log('loading');
        let loading=window.document.getElementById('loading');
        props.onclick()
    }
    return(
        <button className="button" onClick={loading}>{props.text}</button>
    )
}