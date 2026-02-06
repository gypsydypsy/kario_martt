
import ItemBox from "../ItemBox/ItemBox";
import Thwomp from "../Thwomp/Thwomp";
import Tremplin from "../Tremplin/Tremplin";
import Accelerator from "../Accelerator/Accelerator";

const Props = ({elements}) => {
    return (
        <>
            {elements.length && elements.map( (el, index) => {
                if(el.type === 'itembox'){
                    return <ItemBox key={index} rotation={el.rotation} position={el.position}/>
                }
                if(el.type === 'thwomp'){
                    return <Thwomp key={index} rotation={el.rotation} position={el.position}/>
                }
                if(el.type === 'tremplin'){
                    return <Tremplin key={index} rotation={el.rotation} position={el.position}/>
                }
                if(el.type === 'accelerator'){
                    return <Accelerator key={index} rotation={el.rotation} position={el.position}/>
                }
            })}
        </>
    )
}

export default Props; 