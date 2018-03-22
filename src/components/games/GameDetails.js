import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {getGames, joinGame, updateGame} from '../../actions/games'
import {getUsers} from '../../actions/users'
import {userId} from '../../jwt'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import './GameDetails.css'
import { songs } from '../../lib/songs'

class GameDetails extends PureComponent {

  componentWillMount() {
    if (this.props.authenticated) {
      if (this.props.game === null) this.props.getGames()
      if (this.props.users === null) this.props.getUsers()
    }
  }

  joinGame = () => this.props.joinGame(this.props.game.id)
  currentsong = () =>{
    return songs[this.props.game.level]
    }


  makeMoven = (x) => {
    const { game, updateGamen } = this.props
    let answer = ( x == this.currentsong().answer)
    alert(answer)

    updateGamen(game.id, answer)
  }


renderVariants = (x) => {
  return (
  <div className="list">
    <button className="button2" type="submit" tabindex="0"
    onClick={() => this.makeMoven(x)}>
    {x}
    </button>
  </div>

  )
}


  render() {
    const {game, users, authenticated, userId} = this.props

    if (!authenticated) return (
            <Redirect to="/login" />
        )

    if (game === null || users === null) return 'Loading...'
    if (!game) return 'Not found'

    const player = game.players.find(p => p.userId === userId)

    return (<Paper class="outer-paper">
      <h1>Game #{game.id}</h1>

      <p>Status: {game.status}</p>

      Scores:
      {game.players
        .map(player =>{
          return (
            <div>
            {users[player.userId].firstName}: {player.score}
            </div>
            )}
          )}

      {
        game.status === 'started' &&
        player && player.symbol === game.turn &&

        <p>
        <div className="image">
        <img className="" alt="" src={'/list.png'} /></div>

        <div className="turn">Its your turn!</div>

          <iframe className="frame"
          width="10%" height="90" scrolling="no" frameborder="no" allow="autoplay"
          src={this.currentsong().src}>
          </iframe>


          <p></p>


          {this.currentsong().variants
          .map(x => this.renderVariants(x))
          }

          </p>
      }

      {
        game.status === 'pending' &&
        game.players.map(p => p.userId).indexOf(userId) === -1 &&
        <button onClick={this.joinGame}>Join Game</button>
      }

      <hr />
    </Paper>)
  }
}

const mapStateToProps = (state, props) => ({
  authenticated: state.currentUser !== null,
  userId: state.currentUser && userId(state.currentUser.jwt),
  game: state.games && state.games[props.match.params.id],
  users: state.users
})

const mapDispatchToProps = {
  getGames, getUsers, joinGame, updateGame
}

export default connect(mapStateToProps, mapDispatchToProps)(GameDetails)
