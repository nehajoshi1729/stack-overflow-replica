let Question = require('../models/questions');

exports.show_questions_by_askDate = async function (res) {
    try {
        const questions = await Question.find({}).populate({
                path: 'tags',
                select: 'name'
            }).populate({
                path: 'answers',
                select: 'ans_date_time'
            }).populate({
                path: 'asked_by',
                select: 'username'
            }).sort({ ask_date_time: -1 });

        res.json(questions);
        return questions;
    } catch (error) {
        res.status(500).json({ error: 'Unable to render questions by ask date' });
    }
};

exports.show_questions_by_ansDate = async function (res) {
    try {
        const questions = await Question.find({}).populate({
                path: 'tags',
                select: 'name'
            }).populate({
                path: 'answers',
                select: 'ans_date_time'
            }).populate({
                path: 'asked_by',
                select: 'username'
            }).sort({
                lastActive: -1
            });

        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Unable to render questions by most recently answered'})
    }
};

exports.show_only_unanswered = async function (res) {
    try {
        const unansweredQuestions = await Question.find({
            answers: { $size: 0 } // Filter questions with zero answers
        }).populate({
            path: 'tags',
            select: 'name'
        }).populate({
                path: 'asked_by',
                select: 'username'
        });

        res.json(unansweredQuestions);
    } catch (error) {
        res.status(500).json({ error: 'Unable to render unanswered questions' });
    }
};


exports.show_Question = async function (res, questionId) {
    try {
        const question = await Question.findById(questionId)
            .populate({
                path: 'answers',
                options: { sort: { ans_date_time: -1 } },
                populate: [
                    {
                        path: 'comments',
                        options: { sort: { cmnt_date_time: 1 } }, // Sort comments by cmnt_date_time in ascending order
                        populate: { path: 'comment_by', select: 'username' }
                    },
                    {
                        path: 'ans_by',
                        select: 'username'
                    }
                ]
            })
            .populate({
                path: 'comments',
                options: { sort: { cmnt_date_time: 1 } }, // Sort comments by cmnt_date_time in ascending order
                populate: {
                    path: 'comment_by',
                    select: 'username'
                }
            })
            .populate({
                path: 'asked_by',
                select: 'username'
            });

        question.views++; // Update views and save changes
        await question.save();
        res.json(question); // Send results
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



