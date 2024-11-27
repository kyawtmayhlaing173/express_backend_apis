import express, { Response, Request, NextFunction } from "express";
import { prisma } from "../prisma";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const exercises = await prisma.exercise.findMany({
            orderBy: { id: "desc" },
        });
        res.json(exercises);
    } catch (e) {
        res.status(500).json({msg: `${e}`})
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const exercises = req.body;

        const exercise = await prisma.exercise.createMany({
            data: exercises.map((exercise: { name: string; description: string; muscleGroup: string; difficulty: string; }) => ({
                name: exercise.name,
                description: exercise.description,
                muscleGroup: exercise.muscleGroup,
                difficulty: exercise.difficulty
            })),
        });

        const createdExercies = await prisma.exercise.findMany({
            where: {
                name: {
                    in: exercises.map((e: { name: string; }) => e.name)
                }
            }
        })
        res.json(createdExercies);
    } catch (e) {
        res.status(500).json({ msg: `${e}` })
    }
});

export const exerciseRouter = router;