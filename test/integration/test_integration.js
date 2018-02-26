import test from 'ava'
import { Ed25519Keypair, Transaction, Connection } from '../../src'

import {
    alice
} from '../constants'

const API_PATH = 'http://localhost:9984/api/v1/'


test('Keypair is created', t => {
    const keyPair = new Ed25519Keypair()

    t.truthy(keyPair.publicKey)
    t.truthy(keyPair.privateKey)
})

alice.publicKey = '4SFn9xWxLzL5PfyMakFE3ef3mipoaGeSgfkwr8XTMx5B'
alice.privateKey = 'CZxdKpGjNBnLcHk6g6hiwpyjSNzZGAz1QX8cdtdaNp8L'
const aliceCondition = Transaction.makeEd25519Condition(alice.publicKey)
const aliceOutput = Transaction.makeOutput(aliceCondition)
//
//  - tidy up dependency on `pollStatusAndFetchTransaction`
test('Valid CREATE transaction', t => {
    const conn = new Connection(API_PATH)

    const tx = Transaction.makeCreateTransaction(
        {
            'bicycle':
            {
                'manufacturer': 'bkfab',
                'serial_number': 'abcd1234'
            }
        },
        {
            'planet': 'earth'
        },
        [aliceOutput],
        alice.publicKey
    )
    const txSigned = Transaction.signTransaction(tx, alice.privateKey)
    console.dir('txSigned', txSigned)
    return conn.postTransaction(txSigned)
        .then(({ id }) => conn.pollStatusAndFetchTransaction(id))
        .then(resTx => t.truthy(resTx))
})
