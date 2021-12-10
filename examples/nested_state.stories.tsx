import {SliceManager} from '../src/SliceManager';
import { useManager } from '../src/useManager';

export type State = {
    counter: number,
    short: boolean,
    modal: {
        create: {
            open: boolean
        }
    }
}

export const manager = new SliceManager<State>({
    name: 'manager', 
    initialState: {
        counter: 1,
        short: false,
        modal: {
            create: {
                open: false
            }
        }
    },
})

export const ComponentFirst = () => {
    const [{counter, short, modal}, {changeCounter, changeShort, changeModalCreateOpen, changeModal, changeModalCreate}] = useManager<State>(manager)
  
    return (
      <>
      <h1>manager counter {counter}</h1>
        <h1>short {`${short}`}</h1>
        <h1>modal {JSON.stringify(modal)}</h1>
        <button onClick={() => changeCounter(counter + 1)}>
          change counter manager
        </button>
        <button onClick={() => changeModal({
          create: {
            open: true,
          }
        })}>
          change modal
        </button>
        <button onClick={() => changeModalCreate({open: true})}>
          change modal.create
        </button>
        <button onClick={() => changeModalCreateOpen(true)}>
          change modal.create.open
        </button>
        <input type="checkbox" onChange={(e) => changeShort(e.target.checked)} />
        <hr />
        </>
    )
  }