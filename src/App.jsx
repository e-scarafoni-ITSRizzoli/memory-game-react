import { useState, useEffect } from 'react'
import Card from "./components/Card.jsx";
import './App.css'

function App() {
    //const list = [1,2,3,4,5,6,7,8]
    const [shuffledList, setShuffledList] = useState([])
    const [clicked, setClicked] = useState([])
    const [score, setScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const LENGTH = 10;


    useEffect(() => {
        const indexes = randomIndexes()
        let resultList = []
        for (const index of indexes) {
            console.log("inside: " + resultList.toString())
            fetch("https://pokeapi.co/api/v2/pokemon/" + index)
                .then(r => r.json())
                .then(json => (
                    resultList.push({name: json.forms[0].name, urlImage: json.sprites.other["official-artwork"].front_default})
                )).then(len => checkLen(len, resultList))
        }
    }, [gameOver])

    function checkLen(len, list) {
        console.log(len)
        if(len >= LENGTH) {
            setShuffledList(list)
        }
    }

    function randomIndexes() {
        let indexes = []
        while(indexes.length < LENGTH) {
            let random = Math.round(Math.random() * 150 + 1)
            if(!indexes.includes(random)) {
                indexes.push(random)
            }
        }
        return indexes
    }

    function reset() {
        setScore(0)
        setShuffledList([])
        setClicked([])
        setGameOver(!gameOver)
    }


    function shuffle() {
        console.log("Clicked")
        let newList = []
        while(newList.length < shuffledList.length) {
            //console.log(newList.toString())
            let index = Math.round(Math.random() * (shuffledList.length -1));
            //console.log(list[index])
            if(!newList.includes(shuffledList[index])) {
                newList.push(shuffledList[index])
            }
        }
        setShuffledList(newList);
    }

    function checkClick(element) {
        console.log(clicked.toString())
        if(clicked.includes(element)) {
            console.log("Game over");
            if(score > bestScore) {
                setBestScore(score)
            }
            reset()
        } else {
            setClicked([...clicked, element])
            setScore(score + 1)
            shuffle()
        }
    }

    return (
        <>
            <h1> Pokémon Memory Game </h1>
            <h3> Get points by clicking on an image but don't click on the same image more than once!</h3>
            <div className="scores">
                <h4> Score: {score}</h4>
                <h4> Best: {bestScore}</h4>
            </div>
            <div className="cards">
                {shuffledList?.map(el => {
                    return (
                        <div key={el.name} onClick={() => checkClick(el)}>
                            <Card>
                                <img src={el.urlImage}/>
                                <p>{el.name[0].toUpperCase() + el.name.substring(1)}</p>
                            </Card>
                        </div>
                    )
                })}
            </div>
        </>
      )
}

export default App
