import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import './Questions.css';

export interface Questions {
    answer_count: number,
    content_license: number,
    creation_date: number,
    is_answered: boolean,
    last_activity_date: number,
    link: string,
    owner: {
        display_name: string,
        link: string,
        profile_image: string,
        reputation: number,
        user_id: number,
        user_type: string
    },
    question_id: number,
    score: number,
    tags: string[],
    title: string,
    view_count: number,
    body: string

}


const Questions = () => {
    const [questionData, setQuestionData] = useState<Questions[]>([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [link, setLink] = useState('');
    const [items, setItems] = useState(10);
    const[hasMoreItems, setHasMoreItems] = useState(true);

    const fetchQuestions = async () => {
        const res = await fetch('https://api.stackexchange.com/search/advanced?site=stackoverflow.com&filter=withbody');
        const ques = await res.json();
        console.log(ques);
       /*  const updatedQues = ques.map(dt => {
            return {
                title: dt.title
            }
        }) */
        let newQues = [];
        setQuestionData(ques.items);
    }
    
    useEffect(() => {
        fetchQuestions();

    }, [])

    const showQuesDetails = (id: number) => {
        for(let i = 0; i < questionData.length; i++) {
            if(id === i) {
                setTitle(questionData[i].title);
                setBody(questionData[i].body);
                setLink(questionData[i].link);
            }
        }
    }

    const loadMore = () => {
        if(items === 30) {
            setHasMoreItems(false);
        }
        else {
            setTimeout(() => {
                setItems(items + 10);
            }, 2000);
        }
    }

    return (
        <div className="Questions">
            <div style={{height:'350px', overflow:'auto'}}>
                <InfiniteScroll
                    loadMore={loadMore}
                    hasMore={hasMoreItems}
                    loader={<div className="loader"><h5>Loading...</h5></div>}
                    useWindow={false}
                >
                    <table className="quesTable">
                        <th>Author</th>
                        <th>Title</th>
                        <th>Creation Date</th>
                        {questionData.map((ques, id) => (
                            <tr data-toggle="modal" data-target="#myModal" onClick={() => showQuesDetails(id)} className="quesRow">
                                <td>{ques.owner.display_name}</td>
                                <td>{ques.title}</td>
                                <td>{ques.creation_date}</td>
                            </tr>
                        ))}
                    </table>{" "}
                </InfiniteScroll>{" "}
            </div>{" "}
            
            <div className="container">
                <div className="modal fade" id="myModal" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Question details</h4>
                            </div>
                            <div className="modal-body">
                             <table>
                                <th>Title</th>
                                <th>Body</th>
                                <th>Link</th>
                                <tr>
                                    <td>{title}</td>
                                    <td className="bodydata">{body.replace(/(<([^>]+)>)/ig, '')}</td>
                                    <td className="linkdata"><a href={link} target="_blank">{link}</a></td>
                                </tr>
                             </table>
                            </div>
                            <div className="modal-footer">
                                 <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        
    )
}

export default Questions