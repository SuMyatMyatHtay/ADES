//This component is for a Card
export default function Card(props){
    const attack_name=props.card['attack'].map(attack=>{//for multiple attacks
        return(
            <div className="attacks">
                <div className='attack_damage' style={{display:"flex",justifyContent:"center"}}>{attack.attack_damage}</div>
                <div className='attack_name'>{attack.attack_name}</div>
                
            </div>
        )
    })

    return(
        <div className='cards'>
            <div id="top">
                
            <p>Level {props.card.creature_level}</p>
            <p>HP {props.card.hit_points}</p>
            </div>
            <img src={require('../images/cards/'+props.card.card_image)} alt='' className='cards'/>
            <p id="creature_name">{props.card.creature_name}</p>
            <div id="attack_name">
            {attack_name}
            </div>
        </div>
    )
}
