import { Button, Input, List, ListItem, ListItemButton, Textarea } from "@mui/joy";
import DocumentSearchIcon from "./icons/DocumentSearch";
import DocumentCheckIcon from "./icons/DocumentCheck";
import XCircleIcon from "./icons/XCircle";
import PlusIcon from "./icons/Plus";
import MultiplyIcon from "./icons/Multiply";
import ParentesisLeftIcon from "./icons/ParentesisLeft";
import MinusIcon from "./icons/Minus";
import DivideIcon from "./icons/Divide";
import ParentesisRightIcon from "./icons/ParentesisRight";
import data from '../assets/data.json';
import { IFunction, IIdentifier } from "../types/define-expression";
import React, { useState } from "react";
import { useSelectedExpressionContext } from "../contexts/SelectedExpressionContext";
import { usePaginationContext } from "../contexts/PaginationContext";

function DefinitionForm() {
    const { textExpression: selectedExpression, setExpressionText: setExpressionSelected } = useSelectedExpressionContext();
    const { page, setActivePage } = usePaginationContext();
    const [helpText, setHelpText] = useState<string>('Texto de ayuda');
    const [functionItems, setFunctionItems] = useState<IFunction[]>([]);
    const [identifierItems] = useState<IIdentifier[]>(data.identifiers);

    React.useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + 'function_').then((response) => {
            response.json().then((data) => {
                setFunctionItems(data.data as IFunction[]);
            })
        })
    }, []);

    const handleClick = (value: string) => {
        setExpressionSelected(`${selectedExpression} ${value}`.trim());
    }

    return (
        <>
            <div className="flex justify-between items-end">
                <div>
                    <h4 className="font-bold">Expresión</h4>
                </div>
                <div className="flex gap-2">
                    <Button color="primary" startDecorator={<DocumentSearchIcon />}>Validar</Button>
                    <Button color="success" startDecorator={<DocumentCheckIcon />} onClick={() => setActivePage(page + 1)}>Guardar</Button>
                    <Button color="danger" startDecorator={<XCircleIcon />} onClick={() => setActivePage(page - 1)}>Cancelar</Button>
                </div>
            </div>
            <div className="mt-4">
                <Textarea
                    color="primary"
                    minRows={2}
                    variant="outlined"
                    value={selectedExpression}
                    onChange={(e) => setExpressionSelected(e.target.value)}
                />
            </div>
            <div className="mt-4 mx-8 flex gap-4 items-center">
                <div className="flex gap-2">
                    <div className="flex flex-col gap-2">
                        <Button><PlusIcon /></Button>
                        <Button><MultiplyIcon /></Button>
                        <Button><ParentesisLeftIcon /></Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button><MinusIcon /></Button>
                        <Button><DivideIcon /></Button>
                        <Button><ParentesisRightIcon /></Button>
                    </div>
                </div>
                <div className="flex flex-grow flex-col gap-2">
                    <h5>Funciones</h5>
                    <Input placeholder="Categoría" />
                    <div className="border rounded-md p-2 overflow-auto">
                        <List>
                            {functionItems.map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemButton onMouseEnter={() => { setHelpText(item.help_ + '. ' + item.description_) }} onMouseLeave={() => { setHelpText('Texto de ayuda') }} onClick={() => { handleClick(item.label_) }}>{item.name_}</ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </div>
                <div className="flex flex-grow flex-col gap-2">
                    <h5>Identificadores</h5>
                    <Input placeholder="Identificador" />
                    <div className="border rounded-md p-2 overflow-auto">
                        <List>
                            {identifierItems.map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemButton onClick={() => { handleClick(item.value) }}>{item.name}</ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <h4 className="font-bold">Ayuda</h4>
                <p>{helpText}</p>
            </div>
        </>
    )
}

export default DefinitionForm;