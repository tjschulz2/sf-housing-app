'use client';
// Import required libraries
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css'; // Assuming you have a CSS module at this path
import { NextPage } from 'next';

const MyForm: NextPage = () => {
    const [housingType, setHousingType] = useState('');
    const [moveIn, setMoveIn] = useState('');
    const [housemates, setHousemates] = useState('');
    const [contactMethod, setContactMethod] = useState('');
    const [link, setLink] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    const handleOptionClick = (setOption: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        setOption((prev: string) => prev === value ? '' : value);
    }

    const handleLinkClick = (e: React.MouseEvent) => {
        if (!isFormValid) {
            e.preventDefault();
        }
    }

    const handleInputChange = (setStateFunc: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLInputElement>): void => {
        setStateFunc(event.target.value);
    }

    useEffect(() => {
        if (description && housingType && moveIn && housemates && contactMethod && link && email && (contactMethod !== 'phone' || phone)) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [description, housingType, moveIn, housemates, contactMethod, link, email, phone]);


    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <Link href="/directory/people-organizing">Back to directory</Link>
                <h1>Start a new house or apartment</h1>
                <div style={{ height: '1px', backgroundColor: 'gray', width: '100%' }} />
                
                <div>
                    <label>
                        <h2>What should your ideal housemate(s) be interested in doing?</h2>
                        <p className={styles.maxCharacters}>52 characters max</p>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', marginRight: '5px', width: '50%' }}>Looking to live with people</span>
                            <input 
                                className={styles.inputStyle} 
                                type="text" 
                                placeholder="researching and building AI companies" 
                                maxLength={52}
                                onChange={handleInputChange(setDescription)}
                            />
                        </div>
                    </label>
                </div>

                <div>
                    <h2>What type of housing do you want?</h2>
                    <div className={styles.options} onClick={() => handleOptionClick(setHousingType, 'lease')}>
                        <div className={`${styles.option} ${housingType === 'lease' ? styles.optionSelected : ''}`}></div>
                        1-year lease (easier to find)
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setHousingType, 'short')}>
                        <div className={`${styles.option} ${housingType === 'short' ? styles.optionSelected : ''}`}></div>
                        Short-term stay (harder to find)
                    </div>
                </div>

                <div>
                    <h2>When do you want to move in?</h2>
                    <div className={styles.options} onClick={() => handleOptionClick(setMoveIn, 'ASAP')}>
                        <div className={`${styles.option} ${moveIn === 'ASAP' ? styles.optionSelected : ''}`}></div>
                        ASAP
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setMoveIn, '3months')}>
                        <div className={`${styles.option} ${moveIn === '3months' ? styles.optionSelected : ''}`}></div>
                        &lt;3 months
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setMoveIn, 'over3months')}>
                        <div className={`${styles.option} ${moveIn === 'over3months' ? styles.optionSelected : ''}`}></div>
                        3+ months
                    </div>
                </div>

                <div>
                    <h2>How many housemates do you want to live with?</h2>
                    <div className={styles.options} onClick={() => handleOptionClick(setHousemates, '1-2')}>
                        <div className={`${styles.option} ${housemates === '1-2' ? styles.optionSelected : ''}`}></div>
                        1-2
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setHousemates, '3-5')}>
                        <div className={`${styles.option} ${housemates === '3-5' ? styles.optionSelected : ''}`}></div>
                        3-5
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setHousemates, '6-12')}>
                        <div className={`${styles.option} ${housemates === '6-12' ? styles.optionSelected : ''}`}></div>
                        6-12
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setHousemates, '12+')}>
                        <div className={`${styles.option} ${housemates === '12+' ? styles.optionSelected : ''}`}></div>
                        12+
                    </div>
                </div>

                <div>
                    <label>
                        <h2>Whats a link that best describes you?</h2>
                        <p className={styles.maxCharacters}>Personal website, forum page, blog, Instagram, etc.</p>
                        <input className={styles.inputStyle} type="url" placeholder="mywebsite.io" onChange={handleInputChange(setLink)} />
                    </label>
                </div>

                <div>
                    <label>
                        <h2>Whats your email address?</h2>
                        <p className={styles.maxCharacters}>Well use this to contact you about new people looking for housing + communities.</p>
                        <input className={styles.inputStyle} type="email" placeholder="email@address.com" onChange={handleInputChange(setEmail)} />
                    </label>
                </div>
                
                <div>
                    <h2>How would you like people to contact you about housing?</h2>
                    <div className={styles.options} onClick={() => handleOptionClick(setContactMethod, 'phone')}>
                        <div className={`${styles.option} ${contactMethod === 'phone' ? styles.optionSelected : ''}`}></div>
                        Phone number
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setContactMethod, 'email')}>
                        <div className={`${styles.option} ${contactMethod === 'email' ? styles.optionSelected : ''}`}></div>
                        Email address
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setContactMethod, 'twitter')}>
                        <div className={`${styles.option} ${contactMethod === 'twitter' ? styles.optionSelected : ''}`}></div>
                        Twitter DMs (make sure your DMs are on)
                    </div>

                    {contactMethod === 'phone' && 
                        <label>
                            <input className={styles.inputStyle} type="tel" placeholder="Phone number" onChange={handleInputChange(setPhone)} />
                        </label>
                    }
                </div>

                <Link className={`${styles.nextButton} ${isFormValid ? '' : styles.disabled}`} href={isFormValid ? "/next" : "#"} onClick={handleLinkClick}>
                    Next
                </Link>
            </form>
        </div>
    );
}

export default MyForm;