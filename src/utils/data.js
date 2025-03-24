export let courseslist = [
    {
        name: 'ReactJS and a super long title',
        price: '500$',
        chapters_quantity: 10
    },
    {
        name: 'NodeJS',
        price: '400$',
        chapters_quantity: 8
    },
    {
        name: 'MongoDB',
        price: '300$',
        chapters_quantity: 6
    }
]

export const getCoursesList = () => {  
    return courseslist;
}

export let course = {
    name: 'ReactJS',
    duration: '3 months',
    introduction: 'ReactJS is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.',
    price: '500$',
    teacher: 'John Doe',
    chapters: [
        {
            name: 'Introduction to ReactJS',
            content: [
                {
                    type: 'video',
                    url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0'
                },
                {
                    type: 'document',
                    url: 'https://reactjs.org/docs/getting-started.html'
                }
            ]
        },
        {
            name: 'Introduction to ReactJS',
            content: [
                {
                    type: 'video',
                    url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0'
                },
                {
                    type: 'document',
                    url: 'https://reactjs.org/docs/getting-started.html'
                }
            ]
        }
    ]
}

export const getCourse = () => {
    return course;
}