import { Router } from "express"
import userRouter from "./users"
import authRouter from "./auth"
import bettorRouter from "./bettors"
import bettorGroupRouter from "./bettorGroups"
import wagerRouter from "./wagers"

const router = Router()

router.use("/bettors", bettorRouter)
router.use("/bettorGroups", bettorGroupRouter)
router.use("/users", userRouter)
router.use("/wagers", wagerRouter)

router.use("/", authRouter)

export default router