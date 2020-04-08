import { useCallback, useMemo, useState, useEffect } from 'react';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import { Editor, Transforms, createEditor } from 'slate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBold,faItalic,faUnderline,faHeading,} from '@fortawesome/free-solid-svg-icons';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';

import useThemeModel from '../../../models/useThemeModel';
import useEditbarModel from '../../../models/useEditbarModel';
import ToolBar from '../toolbar/ToolBar';
import EditBar from '../toolbar/EditBar'
import { memo } from 'react';

const RichTextDemo = () => {
	const { theme } = useThemeModel();
	const { editList, selectEdit } = useEditbarModel();
	const params = useParams();
	const [value, setValue] = useState(
		JSON.parse(localStorage.getItem(`${params.contentId}`)) || initialValue
	);

	const [showEditBar, setShowEditBar] = useState(false);

	useEffect(() => {
		setValue(JSON.parse(localStorage.getItem(`${params.contentId}`)) || initialValue);
	}, [params.contentId]);

	const renderElement = useCallback((props) => <Element {...props} />, []);
	const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
	const editor = useMemo(() => withReact(createEditor()), []);

	const toggleEditBar = ()=>{
		setShowEditBar(!showEditBar);
	}
	const notLostFocus = (e)=>{
		e && e.preventDefault();
	}

	return (
		<EditField>
			<Slate
				editor={editor}
				value={value}
				onChange={(value) => {
					setValue(value);
					const content = JSON.stringify(value);
					localStorage.setItem(`${params.contentId}`, content);
				}}
			>
				<OriginBar>
					<MarkButton format='bold'>
						<FontAwesomeIcon icon={faBold} />
					</MarkButton>
					<MarkButton format='italic'>
						<FontAwesomeIcon icon={faItalic} />
					</MarkButton>
					<MarkButton format='underline'>
						<FontAwesomeIcon icon={faUnderline} />
					</MarkButton>
					<BlockButton format='heading-one'>
						<FontAwesomeIcon icon={faHeading} />
					</BlockButton>
					<BlockButton format='heading-two'>
						<FontAwesomeIcon icon={faHeading} />
					</BlockButton>
				</OriginBar>
				<ToolBar css={css`position: absolute; right: 20px; bottom: 40px;`} toggleEditBar={toggleEditBar}  onMouseDown={notLostFocus}/>
				<EditBar showEditBar={showEditBar}>
					{editList.map((item, format) => (
						<div
							css={css`
								position: relative;
								cursor: pointer;
								opacity: ${item.active ? 1 : 0.5};
								margin: 3px 0;
							`}
							key={item.format}
							className={item.format}
							onClick={() => selectEdit(item.format)}
							format={item.format}
							active={isBlockActive(editor, format) ? 1 : undefined}
							onMouseDown={(e) => {
								e.preventDefault();
								toggleBlock(editor, item.format);
								console.log(item.format)
							}}
						>
							{/* 小圆点 */}
							<div
								css={css`
									position: absolute;
									top: 50%;
									left: -10px;
									transform: translateY(-50%);
									padding: 3px;
									background: ${theme.primary.base};
									border-radius: 50%;
									display: ${item.active ? 'block' : 'none'};
								`}
							></div>
							{/* 小圆点 */}
							{item.content}
						</div>
					))}
				</EditBar>
				
				<h3>I'm {params.contentId} ,this sentence is for test.</h3>
				<Editable
					renderElement={renderElement}
					renderLeaf={renderLeaf}
					placeholder='Enter some rich text…'
					autoFocus
				/>
			</Slate>
		</EditField>
	);
};

const toggleBlock = (editor, format) => {
	const isActive = isBlockActive(editor, format);
	Transforms.setNodes(editor, {
		type: isActive ? 'paragraph' : format,
	});
};

const toggleMark = (editor, format) => {
	const isActive = isMarkActive(editor, format) ? 1 : undefined;
	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
};

const isBlockActive = (editor, format) => {
	const [match] = Editor.nodes(editor, {
		match: (n) => n.type === format,
	});
	return !!match;
};

const isMarkActive = (editor, format) => {
	const marks = Editor.marks(editor);
	return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
	switch (element.type) {
		case 'heading-one':
			return <h1 {...attributes}>{children}</h1>;
		case 'heading-two':
			return <h2 {...attributes}>{children}</h2>;
		default:
			return <p {...attributes}>{children}</p>;
	}
};

const Leaf = ({ attributes, children, leaf }) => {
	if (leaf.bold) {
		children = <strong>{children}</strong>;
	}
	if (leaf.italic) {
		children = <em>{children}</em>;
	}
	if (leaf.underline) {
		children = <u>{children}</u>;
	}
	return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, children }) => {
	const editor = useSlate();
	return (
		<span
			css={css`
				cursor: pointer;
				margin-left: 15px;
				color: ${format ? 'black' : '#aaa'};
			`}
			active={isBlockActive(editor, format) ? 1 : undefined}
			onMouseDown={(e) => {
				e.preventDefault();
				toggleBlock(editor, format);
				console.log(format)
			}}
		>
			{children}
		</span>
	);
};

const MarkButton = ({ format, children }) => {
	const editor = useSlate();
	return (
		<span
			css={css`
				cursor: pointer;
				margin-left: 15px;
				color: ${format ? 'black' : '#aaa'};
			`}
			active={isMarkActive(editor, format) ? 1 : undefined}
			onMouseDown={(e) => {
				e.preventDefault();
				toggleMark(editor, format);
				console.log(format)
			}}
		>
			{children}
		</span>
	);
};

const OriginBar = styled.div`
	width: 100%;
	height: 55px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2px 4px;
	border-bottom: 2px solid #eee;
`;

const EditField = styled.div`
	position: relative;
	background: #ffffff;
	padding: 20px 50px;
	width: 100%;
	height: 100%;
	margin: 0 auto;
	outline: none;
`;

const initialValue = [
	{
		type: 'paragraph',
		children: [
			{ text: 'This is editable ' },
			{ text: 'rich', bold: true },
			{ text: ' text, ' },
			{ text: 'much', italic: true },
			{ text: ' better than a ' },
			{ text: '<textarea>', code: true },
			{ text: '!' },
		],
	},
	{
		type: 'paragraph',
		children: [
			{
				text:
					"Since it's rich text, you can do things like turn a selection of text ",
			},
			{ text: 'bold', bold: true },
			{
				text:
					', or add a semantically rendered block quote in the middle of the page, like this:',
			},
		],
	},
	{
		type: 'paragraph',
		children: [{ text: 'Try it out for yourself!' }],
	},
];

export default memo(RichTextDemo);
