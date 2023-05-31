import * as React from 'react';
import { RichTextInput } from 'ra-input-rich-text';
import {
    TopToolbar,
    AutocompleteInput,
    ArrayInput,
    BooleanInput,
    CheckboxGroupInput,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    CloneButton,
    CreateButton,
    ShowButton,
    EditButton,
    ImageField,
    ImageInput,
    NumberInput,
    ReferenceManyField,
    ReferenceManyCount,
    ReferenceInput,
    SelectInput,
    SimpleFormIterator,
    TabbedForm,
    TextField,
    TextInput,
    minValue,
    number,
    required,
    FormDataConsumer,
    useCreateSuggestionContext,
    EditActionsProps,
    usePermissions,
    AutocompleteArrayInput,
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import {
    Box,
    BoxProps,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField as MuiTextField,
} from '@mui/material';
import PostTitle from './PostTitle';
import TagReferenceInput from './TagReferenceInput';

const CreateCategory = ({
    onAddChoice,
}: {
    onAddChoice: (record: any) => void;
}) => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [value, setValue] = React.useState(filter || '');
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const choice = { name: value, id: value.toLowerCase() };
        onAddChoice(choice);
        onCreate(choice);
        setValue('');
        return false;
    };
    return (
        <Dialog open onClose={onCancel}>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <MuiTextField
                        label="New Category"
                        value={value}
                        onChange={event => setValue(event.target.value)}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Save</Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const CreateLabel = ({
    onAddChoice,
}: {
    onAddChoice: (record: any) => void;
}) => {
    const { filter, onCreate } = useCreateSuggestionContext();

    React.useEffect(() => {
        console.log('qsdqsd', filter);
        const newChoice = { id: filter };
        onAddChoice(newChoice);
        onCreate(newChoice);
    }, [filter, onCreate]);

    return null;
};

const EditActions = ({ hasShow }: EditActionsProps) => (
    <TopToolbar>
        <CloneButton className="button-clone" />
        {hasShow && <ShowButton />}
        {/* FIXME: added because react-router HashHistory cannot block navigation induced by address bar changes */}
        <CreateButton />
    </TopToolbar>
);

const SanitizedBox = ({
    fullWidth,
    ...props
}: BoxProps & { fullWidth?: boolean }) => <Box {...props} />;

const categories = [
    { name: 'Tech', id: 'tech' },
    { name: 'Lifestyle', id: 'lifestyle' },
];

const PostEdit = () => {
    const { permissions } = usePermissions();
    const [choices, setChoices] = React.useState([
        { id: 'foo' },
        { id: 'bar' },
        { id: 'baz' },
    ]);

    return (
        <Edit title={<PostTitle />} actions={<EditActions />}>
            <TabbedForm
                defaultValues={{ average_note: 0 }}
                warnWhenUnsavedChanges
            >
                <TabbedForm.Tab label="post.form.summary">
                    <SanitizedBox
                        display="flex"
                        flexDirection="column"
                        width="100%"
                        justifyContent="space-between"
                        fullWidth
                    >
                        <TextInput disabled source="id" />
                        <TextInput
                            source="title"
                            validate={required()}
                            resettable
                        />
                    </SanitizedBox>
                    <AutocompleteArrayInput
                        fullWidth
                        optionText="id"
                        choices={choices}
                        source="labels_with_onCreate"
                        onCreate={(value: string | undefined) => {
                            console.log({ value });
                            const t = { id: value };
                            setChoices(previousChoices =>
                                previousChoices.concat(t)
                            );
                            return t;
                        }}
                    />
                    <AutocompleteArrayInput
                        fullWidth
                        optionText="id"
                        choices={choices}
                        source="labels_with_create"
                        create={
                            <CreateLabel
                                onAddChoice={newChoice => {
                                    console.log({ newChoice });
                                    setChoices(previousChoices =>
                                        previousChoices.concat(newChoice)
                                    );
                                }}
                            />
                        }
                    />
                    <AutocompleteArrayInput
                        fullWidth
                        optionText="id"
                        choices={choices}
                        source="labels_with_createcategory"
                        create={
                            <CreateCategory
                                // Added on the component because we have to update the choices
                                // ourselves as we don't use a ReferenceInput
                                onAddChoice={newChoice => {
                                    console.log({ newChoice });
                                    setChoices(oldChoices =>
                                        oldChoices.concat(newChoice)
                                    );
                                }}
                            />
                        }
                    />
                    <TextInput
                        multiline
                        fullWidth
                        source="teaser"
                        validate={required()}
                        resettable
                    />
                    <CheckboxGroupInput
                        source="notifications"
                        fullWidth
                        choices={[
                            { id: 12, name: 'Ray Hakt' },
                            { id: 31, name: 'Ann Gullar' },
                            { id: 42, name: 'Sean Phonee' },
                        ]}
                    />
                    <ImageInput
                        multiple
                        source="pictures"
                        accept="image/*"
                        helperText=""
                    >
                        <ImageField source="src" title="title" />
                    </ImageInput>
                    {permissions === 'admin' && (
                        <ArrayInput source="authors">
                            <SimpleFormIterator inline>
                                <ReferenceInput
                                    source="user_id"
                                    reference="users"
                                >
                                    <AutocompleteInput helperText={false} />
                                </ReferenceInput>
                                <FormDataConsumer>
                                    {({
                                        formData,
                                        scopedFormData,
                                        getSource,
                                        ...rest
                                    }) =>
                                        scopedFormData &&
                                        scopedFormData.user_id ? (
                                            <SelectInput
                                                source={getSource('role')}
                                                choices={[
                                                    {
                                                        id: 'headwriter',
                                                        name: 'Head Writer',
                                                    },
                                                    {
                                                        id: 'proofreader',
                                                        name: 'Proof reader',
                                                    },
                                                    {
                                                        id: 'cowriter',
                                                        name: 'Co-Writer',
                                                    },
                                                ]}
                                                helperText={false}
                                                {...rest}
                                            />
                                        ) : null
                                    }
                                </FormDataConsumer>
                            </SimpleFormIterator>
                        </ArrayInput>
                    )}
                </TabbedForm.Tab>
                <TabbedForm.Tab label="post.form.body">
                    <RichTextInput
                        source="body"
                        label=""
                        validate={required()}
                        fullWidth
                    />
                </TabbedForm.Tab>
                <TabbedForm.Tab label="post.form.miscellaneous">
                    <TagReferenceInput
                        reference="tags"
                        source="tags"
                        label="Tags"
                    />
                    <ArrayInput source="backlinks">
                        <SimpleFormIterator>
                            <DateInput source="date" />
                            <TextInput source="url" validate={required()} />
                        </SimpleFormIterator>
                    </ArrayInput>
                    <DateInput source="published_at" />
                    <SelectInput
                        create={
                            <CreateCategory
                                // Added on the component because we have to update the choices
                                // ourselves as we don't use a ReferenceInput
                                onAddChoice={choice => categories.push(choice)}
                            />
                        }
                        resettable
                        source="category"
                        choices={categories}
                    />
                    <NumberInput
                        source="average_note"
                        validate={[required(), number(), minValue(0)]}
                    />
                    <BooleanInput source="commentable" defaultValue />
                    <TextInput disabled source="views" />
                    <ArrayInput source="pictures">
                        <SimpleFormIterator>
                            <TextInput source="url" defaultValue="" />
                            <ArrayInput source="metas.authors">
                                <SimpleFormIterator>
                                    <TextInput source="name" defaultValue="" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleFormIterator>
                    </ArrayInput>
                </TabbedForm.Tab>
                <TabbedForm.Tab
                    label="post.form.comments"
                    count={
                        <ReferenceManyCount
                            reference="comments"
                            target="post_id"
                            sx={{ lineHeight: 'inherit' }}
                        />
                    }
                >
                    <ReferenceManyField
                        reference="comments"
                        target="post_id"
                        fullWidth
                    >
                        <Datagrid>
                            <DateField source="created_at" />
                            <TextField source="author.name" />
                            <TextField source="body" />
                            <EditButton />
                        </Datagrid>
                    </ReferenceManyField>
                </TabbedForm.Tab>
            </TabbedForm>
        </Edit>
    );
};

export default PostEdit;
