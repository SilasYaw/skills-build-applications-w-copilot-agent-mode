import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models.js';
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to octofit_db');
        console.log('Seed the octofit_db database with test data');
        await Promise.all([
            Activity.deleteMany({}),
            LeaderboardEntry.deleteMany({}),
            User.deleteMany({}),
            Team.deleteMany({}),
            Workout.deleteMany({}),
        ]);
        const [trailblazers, coreCrew] = await Team.create([
            { name: 'Trailblazers', members: [] },
            { name: 'Core Crew', members: [] },
        ]);
        const [maya, liam, ava, noah] = await User.create([
            {
                username: 'maya_runner',
                email: 'maya@example.com',
                displayName: 'Maya Chen',
                team: trailblazers._id,
            },
            {
                username: 'liam_lifts',
                email: 'liam@example.com',
                displayName: 'Liam Patel',
                team: trailblazers._id,
            },
            {
                username: 'ava_cycles',
                email: 'ava@example.com',
                displayName: 'Ava Johnson',
                team: coreCrew._id,
            },
            {
                username: 'noah_moves',
                email: 'noah@example.com',
                displayName: 'Noah Garcia',
                team: coreCrew._id,
            },
        ]);
        await Promise.all([
            Team.findByIdAndUpdate(trailblazers._id, { members: [maya._id, liam._id] }),
            Team.findByIdAndUpdate(coreCrew._id, { members: [ava._id, noah._id] }),
        ]);
        await Activity.create([
            {
                user: maya._id,
                activityType: 'Outdoor Run',
                durationMinutes: 42,
                caloriesBurned: 430,
                completedAt: new Date('2026-09-05T14:30:00Z'),
            },
            {
                user: liam._id,
                activityType: 'Strength Training',
                durationMinutes: 55,
                caloriesBurned: 390,
                completedAt: new Date('2026-09-06T18:15:00Z'),
            },
            {
                user: ava._id,
                activityType: 'Cycling',
                durationMinutes: 68,
                caloriesBurned: 610,
                completedAt: new Date('2026-09-07T12:00:00Z'),
            },
            {
                user: noah._id,
                activityType: 'Yoga Flow',
                durationMinutes: 35,
                caloriesBurned: 180,
                completedAt: new Date('2026-09-08T07:45:00Z'),
            },
        ]);
        await LeaderboardEntry.create([
            { user: ava._id, score: 1580, rank: 1 },
            { user: maya._id, score: 1420, rank: 2 },
            { user: liam._id, score: 1335, rank: 3 },
            { user: noah._id, score: 980, rank: 4 },
        ]);
        await Workout.create([
            {
                title: 'Morning Mobility Reset',
                description: 'A low-impact routine for joint mobility, breath work, and light core activation.',
                difficulty: 'beginner',
                durationMinutes: 20,
            },
            {
                title: 'Tempo Strength Builder',
                description: 'Controlled compound movements focused on form, stability, and progressive resistance.',
                difficulty: 'intermediate',
                durationMinutes: 45,
            },
            {
                title: 'Endurance Ride Intervals',
                description: 'Bike intervals alternating steady-state efforts with short threshold pushes.',
                difficulty: 'intermediate',
                durationMinutes: 50,
            },
            {
                title: 'Advanced Metabolic Circuit',
                description: 'A high-intensity circuit combining kettlebell swings, burpees, rowing, and recovery rounds.',
                difficulty: 'advanced',
                durationMinutes: 38,
            },
        ]);
        console.log('Database seeding complete');
        await mongoose.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
