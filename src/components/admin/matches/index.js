import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../hoc/AdminLayout';
import { firebaseMatches } from '../../../firebase';
import { firebaseLooper, reverseArray } from '../../ui/misc';

import { Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress } from '@material-ui/core';

export default class AdminMatches extends Component {

  state = {
    isLoading: true,
    matches: []
  }

  componentDidMount() {
    firebaseMatches.once('value').then(snapshot => {
      const matches = firebaseLooper(snapshot);

      this.setState({
        isLoading: false,
        matches: reverseArray(matches)
      })
    })
  }

  render() {
    return (
      <AdminLayout>
        <div>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Match</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Final</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.matches ?
                    this.state.matches.map((match, i) => (
                      <TableRow key={i}>
                        <TableCell>{match.date}</TableCell>
                        <TableCell>
                          <Link to={`/admin_matches/edit_match/${match.id}`}>
                            {match.away} <strong>-</strong> {match.local}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {match.resultAway} <strong>-</strong> {match.resultLocal}
                        </TableCell>
                        <TableCell>
                          {
                            match.final === "Yes" ?
                              <span className="matches_tag_red">Final</span>
                              : <span className="matches_tag_green">Not played yet</span>
                          }
                        </TableCell>
                      </TableRow>
                    ))
                :null
                }
              </TableBody>
            </Table>
          </Paper>
        
          <div className="admin_progress">
            {
              this.state.isLoading ?
              <CircularProgress thickness={7} style={{ color: '#98c5e9'}} />
              :
              null
            }
          </div>
        </div>
      </AdminLayout>
    )
  }
}
