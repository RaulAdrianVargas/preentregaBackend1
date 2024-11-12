import {Router} from "express";

const router = Router();

router.get("/:cid", (req, res)=>{
    const {cid} = req.params;
    return res.json({});
})

router.post("/", (req, res)=>{
    return res.json({});
})

router.post("/:cid/product/:pid", (req, res)=>{
    const {cid, pid} = req.params;
    return res.json({});
})


export default router;
