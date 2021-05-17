import { useQuery } from "@apollo/client"
import {
    Button as MatButton,
    Modal, 
    ModalHeader, 
    ModalBody, 
    Table,
    ModalFooter,
  } from "reactstrap"
import { FILTER_DETAILS } from "./Query"
  
function DetailModal ({toggle2, modal2, className, filterID }) {

    const { data } = useQuery(FILTER_DETAILS, {
        variables: { filterID }
    })

    return (
        <Modal isOpen={modal2} toggle={toggle2} className={className}>
            <ModalHeader toggle={toggle2}>Category title</ModalHeader>
                <ModalBody>
                    <Table dark>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data.filterDetails.map((e, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{e.name}</td>
                                        <td><MatButton color="danger">DELETE</MatButton></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </ModalBody>
            <ModalFooter>
            </ModalFooter>
        </Modal>
    )
}

export default DetailModal